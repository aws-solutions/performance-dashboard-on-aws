// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import "@testing-library/cypress/add-commands";
import "cypress-file-upload";

beforeEach(() => {
  cy.viewport(1280, 768); // Run all tests in a desktop view by default
});

// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
