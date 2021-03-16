// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command login with Cognito authentication
     */
    login(): void;
    createDashboard(name: string, description: string): void;
    navigateTo(screen: string): void;
    deleteDraftDashboard(name: string): void;
  }
}
