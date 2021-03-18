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
    // Capture the http request
    cy.intercept({
      method: "POST",
      url: "/prod/user",
    }).as("createUserRequest");

    cy.get("form").submit();
    cy.wait(["@createUserRequest"]);
  }
}

export default AddUsersPage;
