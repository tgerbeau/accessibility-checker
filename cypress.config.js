import { defineConfig } from 'cypress';
import { appendFileSync } from 'node:fs';

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    video: false,
    screenshotOnRunFailure: false,
    setupNodeEvents(on, config) {
      on('task', {
        // Chaque page auditée est ajoutée au fichier de résultats (NDJSON)
        rgaaResult(page) {
          appendFileSync(config.env.rgaa.resultsFile, JSON.stringify(page) + '\n', 'utf8');
          return null;
        }
      });
      return config;
    }
  }
});
