import AdminHomepage from "./AdminHomepage";

class LoginPage {
  private adminUsername: string;
  private adminPassowrd: string;

  private labels = {
    signInLabel: "Sign In",
  };

  private selectors = {
    signInSlot: 'amplify-sign-in[slot="sign-in"]',
    signInUsernameInput: '[data-test="sign-in-username-input"]',
    signInPasswordInput: '[data-test="sign-in-password-input"]',
    signInSignInButton: '[data-test="sign-in-sign-in-button"]',
  };

  constructor() {
    this.adminUsername = Cypress.env("username");
    this.adminPassowrd = Cypress.env("password");

    if (!this.adminUsername || !this.adminPassowrd) {
      throw new Error(
        "You need to specify env variables `username` " +
          "and `password` in the `cypress.env.json`."
      );
    }
  }

  visit() {
    // Capture the http request
    cy.intercept({
      method: "GET",
      url: "/prod/public/settings",
    }).as("publicSettingsRequest");

    // Direct user to login page
    cy.visit("/admin");
    cy.wait(["@publicSettingsRequest"]);
  }

  loginAsAdmin(): AdminHomepage {
    // Capture the http request
    cy.intercept({
      method: "GET",
      url: "/prod/public/settings",
    }).as("publicSettingsRequest");

    // Direct user to login page
    cy.visit("/admin");
    cy.wait(["@publicSettingsRequest"]);

    // Capture http requests
    cy.intercept({
      method: "GET",
      url: "/prod/settings",
    }).as("settingsRequest");

    cy.intercept({
      method: "GET",
      url: "/public/logo",
    }).as("logoRequest");

    // Type in credentials, click Sign In button, and directed to admin homepage
    cy.get(this.selectors.signInSlot, { includeShadowDom: true })
      .find(this.selectors.signInUsernameInput, { includeShadowDom: true })
      .type(this.adminUsername, { log: false, force: true });

    cy.get(this.selectors.signInSlot, { includeShadowDom: true })
      .find(this.selectors.signInPasswordInput, { includeShadowDom: true })
      .type(this.adminPassowrd, { log: false, force: true });

    cy.get(this.selectors.signInSlot, { includeShadowDom: true })
      .find(this.selectors.signInSignInButton, { includeShadowDom: true })
      .contains(this.labels.signInLabel)
      .click();
    cy.wait(["@settingsRequest", "@logoRequest"]);

    return new AdminHomepage();
  }
}

export default LoginPage;
