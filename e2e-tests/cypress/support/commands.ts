// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

export const labels = {
  signInLabel: "Sign In",
};

export const selectors = {
  signInSlot: 'slot[name="sign-in"]',
  signInUsernameInput: '[data-test="sign-in-username-input"]',
  signInPasswordInput: '[data-test="sign-in-password-input"]',
  signInSignInButton: '[data-test="sign-in-sign-in-button"]',
};

Cypress.Commands.add("login", () => {
  const username = Cypress.env("username");
  const password = Cypress.env("password");

  if (!username || !password) {
    throw new Error(
      "You need to specify env variables `username`, `baseUrl` " +
        "and `password` in the `cypress.env.json`."
    );
  }

  cy.visit("/admin");
  cy.get(selectors.signInSlot, { includeShadowDom: true })
    .find(selectors.signInUsernameInput, { includeShadowDom: true })
    .type(username, { log: false, force: true });

  cy.get(selectors.signInSlot, { includeShadowDom: true })
    .find(selectors.signInPasswordInput, { includeShadowDom: true })
    .type(password, { log: false, force: true });

  cy.get(selectors.signInSlot, { includeShadowDom: true })
    .find(selectors.signInSignInButton, { includeShadowDom: true })
    .contains(labels.signInLabel)
    .click();
});
