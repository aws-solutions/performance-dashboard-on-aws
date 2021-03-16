// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command login with Cognito authentication
     */
    login(): Chainable<Element>;
  }
}
