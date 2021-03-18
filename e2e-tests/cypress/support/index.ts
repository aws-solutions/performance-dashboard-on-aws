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
import login from "./commands/login";
import createDashboard from "./commands/create-dashboard";
import deleteDraftDashboard from "./commands/delete-dashboard";
import navigateTo from "./commands/navigate";

Cypress.Commands.add("login", login);
Cypress.Commands.add("createDashboard", createDashboard);
Cypress.Commands.add("deleteDraftDashboard", deleteDraftDashboard);
Cypress.Commands.add("navigateTo", navigateTo);
