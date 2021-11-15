class ChangeUsersRolePage {
  constructor() {
    cy.get("h1").contains("Change role");
  }

  verifyEmailAddress(userEmail: string) {
    cy.findByLabelText("User email address(es)*").contains(userEmail);
  }

  selectEditorRole() {
    cy.findByLabelText("Editor").check({ force: true });
  }

  submit() {
    // Capture the http requests
    cy.intercept({
      method: "PUT",
      url: "/prod/user/role",
    }).as("changeRoleRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/user",
    }).as("listUsersRequest");

    // Direct to Manage users page
    cy.get("form").submit();
    cy.wait(["@changeRoleRequest", "@listUsersRequest"]);
  }
}

export default ChangeUsersRolePage;
