// Poste (ou met à jour) un commentaire de synthèse RGAA sur la pull request.
// Invoqué par action.yml via actions/github-script.
const fs = require('node:fs');
const path = require('node:path');

const MARKER = '<!-- rgaa-ci-report -->';
const SEVERITY_LABELS = {
  critical: 'Critique',
  serious: 'Sérieux',
  moderate: 'Modéré',
  minor: 'Mineur',
};

function buildBody(report, runUrl) {
  const t = report.totals;
  const failed = t.violationsAboveThreshold > 0;
  const status = failed
    ? `❌ **${t.violationsAboveThreshold} violation(s) au-dessus du seuil \`${report.config.failOn}\`**`
    : '✅ **Aucune violation au-dessus du seuil**';

  const lines = [
    MARKER,
    '## Rapport d\u2019accessibilité RGAA',
    '',
    status,
    '',
    `${t.pages} page(s) analysée(s)` + (t.pageErrors ? `, ${t.pageErrors} page(s) en erreur` : '') + ` — ${report.referential}`,
    '',
    '| Sévérité | Violations |',
    '|---|---|',
  ];
  for (const [sev, label] of Object.entries(SEVERITY_LABELS)) {
    lines.push(`| ${label} | ${t.violationsBySeverity[sev] ?? 0} |`);
  }

  // Regroupement par critère RGAA
  const byCriterion = new Map();
  for (const page of report.pages || []) {
    for (const v of page.violations || []) {
      for (const c of v.rgaaCriteria || []) {
        const entry = byCriterion.get(c) || { theme: v.rgaaTheme, occurrences: 0, rules: new Set() };
        entry.occurrences += (v.nodes || []).length;
        entry.rules.add(v.rule);
        byCriterion.set(c, entry);
      }
    }
  }

  if (byCriterion.size > 0) {
    lines.push('', '<details><summary>Détail par critère RGAA</summary>', '',
      '| Critère | Thématique | Occurrences | Règles axe |', '|---|---|---|---|');
    const sorted = [...byCriterion.entries()].sort(([a], [b]) =>
      a.localeCompare(b, 'fr', { numeric: true }));
    for (const [criterion, e] of sorted) {
      lines.push(`| ${criterion} | ${e.theme || '—'} | ${e.occurrences} | ${[...e.rules].join(', ')} |`);
    }
    lines.push('', '</details>');
  }

  lines.push('', `📎 Rapport complet (HTML + JSON) dans les [artefacts du run](${runUrl}).`,
    '', '> ⚠️ Les tests automatiques ne couvrent qu\u2019une partie du RGAA ; un audit manuel reste nécessaire.');
  return lines.join('\n');
}

module.exports = async function postComment({ github, context, core }, reportDir) {
  const reportPath = path.join(reportDir || 'rgaa-report', 'rgaa-report.json');
  if (!fs.existsSync(reportPath)) {
    core.warning(`Rapport introuvable : ${reportPath} — pas de commentaire de PR.`);
    return;
  }
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const runUrl = `${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`;
  const body = buildBody(report, runUrl);

  const issue_number = context.issue.number;
  const { data: comments } = await github.rest.issues.listComments({
    ...context.repo,
    issue_number,
    per_page: 100,
  });
  const existing = comments.find((c) => c.body && c.body.includes(MARKER));
  if (existing) {
    await github.rest.issues.updateComment({ ...context.repo, comment_id: existing.id, body });
    core.info(`Commentaire RGAA mis à jour (#${existing.id}).`);
  } else {
    await github.rest.issues.createComment({ ...context.repo, issue_number, body });
    core.info('Commentaire RGAA créé.');
  }
};
