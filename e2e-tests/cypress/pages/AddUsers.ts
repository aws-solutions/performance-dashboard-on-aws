class AddUsersPage {
  constructor() {
    cy.contains("Add users");
  }

  fillEmailAddress(userEmail: string) {
    cy.findByLabelText("User email address(es)").type(userEmail);
  }

  selectAdminRole() {
    cy.findByLabelText("Admin").check({ force: true });
  }

  submit() {
    // Capture the http requests
    cy.intercept({
      method: "POST",
      url: "/prod/user",
    }).as("createUserRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/user",
    }).as("listUsersRequest");

    // Direct to Manage users page
    cy.get("form").submit();
    cy.wait(["@createUserRequest", "@listUsersRequest"]);
  }
}

export default AddUsersPage;
