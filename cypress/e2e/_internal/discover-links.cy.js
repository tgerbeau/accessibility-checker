/**
 * Spec Cypress interne : visite chaque URL de départ et extrait ses liens
 * de même origine, afin d'étendre automatiquement l'audit aux « pages
 * principales » du site sans que l'utilisateur ait à toutes les lister.
 * Utilisée par src/discover.js — jamais exécutée directement par l'audit
 * RGAA (voir le paramètre `spec` explicite dans runner.js/discover.js).
 */
const conf = Cypress.env('rgaaDiscover');

describe('Découverte des pages internes', () => {
  (conf.seeds ?? []).forEach((url) => {
    it(`découvre les liens de ${url}`, () => {
      cy.visit(url, {
        headers: conf.httpHeaders ?? {},
        auth: conf.basicAuth ?? undefined,
        failOnStatusCode: false
      });

      // Même heuristique de rendu (SPA) que l'audit RGAA
      cy.get('body', { timeout: 30000 }).should(($b) => {
        expect($b.find('*').length, 'nombre d\'éléments dans <body>').to.be.greaterThan(10);
      });
      if (conf.waitAfterLoad) cy.wait(conf.waitAfterLoad);

      cy.document().then((doc) => {
        const origin = new URL(url).origin;
        const links = [...doc.querySelectorAll('a[href]')]
          .map((a) => a.href)
          .filter((href) => {
            try {
              const u = new URL(href);
              return u.origin === origin && /^https?:$/.test(u.protocol);
            } catch {
              return false;
            }
          });

        cy.task('rgaaDiscovered', { seed: url, links: [...new Set(links)] });
      });
    });
  });
});
