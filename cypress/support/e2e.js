import 'cypress-axe';

// Les erreurs JS du site audité ne doivent pas interrompre l'audit
Cypress.on('uncaught:exception', () => false);

