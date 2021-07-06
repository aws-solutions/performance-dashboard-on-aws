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
    cy.visit("/admin");
  }

  loginAsAdmin(): AdminHomepage {
    cy.visit("/admin");
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
    return new AdminHomepage();
  }
}

export default LoginPage;
