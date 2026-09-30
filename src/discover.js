/**
 * Découverte automatique des « pages principales » d'un site à partir
 * d'URL(s) de départ : visite chaque page avec Cypress (rendu JS inclus,
 * nécessaire pour les SPA) et en extrait les liens internes (même origine).
 *
 * Une seule profondeur (liens présents sur les pages de départ, pas de
 * récursion) : l'objectif est de couvrir les gabarits principaux du site
 * sans transformer l'outil en robot d'indexation généraliste.
 */
import cypress from 'cypress';
import { mkdirSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Extensions de fichiers à ignorer (téléchargements, images, etc. : pas des « pages »)
const IGNORED_EXTENSIONS = /\.(pdf|zip|jpe?g|png|gif|svg|webp|docx?|xlsx?|pptx?|csv|ico)$/i;

/** Clé de dédoublonnage par route : origine + chemin, sans requête ni ancre. */
function routeKey(href) {
  const u = new URL(href);
  return `${u.origin}${u.pathname.replace(/\/+$/, '') || '/'}`;
}

/**
 * Découvre les pages internes accessibles depuis `conf.urls` (les URLs
 * fournies servent de « graines »). Retourne un tableau d'URLs découvertes,
 * dédoublonnées par route (une seule variante par gabarit, par ex. une seule
 * URL `/carte?lon=…` même si la page en propose des dizaines) et triées en
 * priorisant les chemins les plus courts (pages principales avant pages
 * profondes).
 */
export async function discoverPages(conf) {
  const outputDir = resolve(conf.output);
  mkdirSync(outputDir, { recursive: true });
  const resultsFile = join(outputDir, '.rgaa-discovered.ndjson');
  rmSync(resultsFile, { force: true });

  if (!conf.quiet) console.log(`▶ Découverte des pages principales depuis ${conf.urls.length} URL(s) de départ …`);

  let run;
  try {
    run = await cypress.run({
      project: PKG_ROOT,
      browser: 'electron',
      quiet: true,
      spec: 'cypress/e2e/_internal/discover-links.cy.js',
      config: {
        viewportWidth: conf.viewportSize.width,
        viewportHeight: conf.viewportSize.height,
        pageLoadTimeout: conf.timeout,
        video: false,
        screenshotOnRunFailure: false
      },
      env: {
        rgaaDiscover: {
          seeds: conf.urls,
          httpHeaders: conf.httpHeaders,
          basicAuth: conf.basicAuth,
          waitAfterLoad: conf.waitAfterLoad,
          resultsFile
        }
      }
    });
  } catch (e) {
    if (!conf.quiet) console.warn(`  ⚠ Découverte impossible (${e.message}) — analyse limitée aux URLs fournies.`);
    return [];
  }

  const rows = existsSync(resultsFile)
    ? readFileSync(resultsFile, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l))
    : [];
  rmSync(resultsFile, { force: true });

  if (!rows.length) {
    if (!conf.quiet) console.warn(`  ⚠ Découverte impossible (${run.message ?? 'erreur Cypress'}) — analyse limitée aux URLs fournies.`);
    return [];
  }

  const seen = new Set(conf.urls.map(routeKey));
  const discovered = [];
  for (const row of rows) {
    for (const href of row.links ?? []) {
      if (IGNORED_EXTENSIONS.test(href)) continue;
      let key;
      try {
        key = routeKey(href);
      } catch {
        continue;
      }
      if (seen.has(key)) continue;
      seen.add(key);
      discovered.push(href);
    }
  }

  discovered.sort((a, b) => new URL(a).pathname.length - new URL(b).pathname.length);
  return discovered;
}
