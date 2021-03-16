describe("Login", () => {
  it("takes the user to the welcome page", () => {
    cy.login();

    // Assert the welcome message is present
    cy.contains("Welcome to the Performance Dashboard");

    // Assert the 4 buttons are present
    cy.get("button").contains("Create dashboard");
    cy.get("button").contains("Manage users");
    cy.get("button").contains("View settings");
    cy.get("button").contains("View the published site");
  });
});
