/**
 * Spec Cypress : audite chaque URL avec axe-core (locale fr) et mappe
 * les violations vers les critères RGAA 4.1. Les résultats sont remontés
 * au processus Node via cy.task ; le seuil d'échec est appliqué par la CLI.
 */
import { mapRule } from '../../src/rgaa-mapping.js';
import frLocale from 'axe-core/locales/fr.json';

const conf = Cypress.env('rgaa');

const AXE_OPTIONS = {
  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
  rules: Object.fromEntries((conf.ignoreRules ?? []).map((r) => [r, { enabled: false }]))
};

describe('Audit RGAA (critères automatisables)', () => {
  conf.urls.forEach((url) => {
    it(`analyse ${url}`, () => {
      // Neutralise la CSP (en-tête et balise meta) qui bloquerait l'injection d'axe-core
      cy.intercept({ resourceType: 'document' }, (req) => {
        req.continue((res) => {
          delete res.headers['content-security-policy'];
          delete res.headers['content-security-policy-report-only'];
          if (typeof res.body === 'string') {
            res.body = res.body.replace(
              /<meta[^>]*http-equiv=["']?content-security-policy["']?[^>]*>/gi,
              ''
            );
          }
        });
      });

      cy.visit(url, {
        headers: conf.httpHeaders ?? {},
        auth: conf.basicAuth ?? undefined,
        failOnStatusCode: false
      });

      // Attend le rendu effectif (SPA) : le DOM doit contenir un contenu significatif
      cy.get('body', { timeout: 30000 }).should(($b) => {
        expect($b.find('*').length, 'nombre d\'éléments dans <body>').to.be.greaterThan(10);
      });
      if (conf.waitAfterLoad) cy.wait(conf.waitAfterLoad);

      cy.injectAxe();
      cy.configureAxe({ locale: frLocale });

      cy.window({ log: false })
        .then({ timeout: 120000 }, (win) => win.axe.run(win.document, AXE_OPTIONS))
        .then((results) => {
          const violations = results.violations.map((v) => {
            const { rgaa, theme } = mapRule(v.id);
            return {
              rule: v.id,
              impact: v.impact ?? 'minor',
              description: v.description,
              help: v.help,
              helpUrl: v.helpUrl,
              rgaaCriteria: rgaa,
              rgaaTheme: theme,
              nodes: v.nodes.slice(0, 20).map((n) => ({
                target: n.target.join(' '),
                html: n.html.slice(0, 300),
                failureSummary: n.failureSummary
              })),
              nodeCount: v.nodes.length
            };
          });

          cy.task('rgaaResult', {
            url,
            timestamp: new Date().toISOString(),
            passesCount: results.passes.length,
            incompleteCount: results.incomplete.length,
            violations
          });

          cy.log(`${violations.length} règle(s) en échec`);
        });
    });
  });
});
