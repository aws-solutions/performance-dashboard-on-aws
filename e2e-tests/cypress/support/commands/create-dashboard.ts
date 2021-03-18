function createDashboard(name: string, description: string) {
  cy.navigateTo("DashboardList");
  cy.findByRole("button", { name: "Create dashboard" }).click();

  // Fill in the form inputs
  cy.findByLabelText("Dashboard Name").type(name);
  cy.findByLabelText("Description - optional").type(description);

  // Verify that preview shows up
  cy.findByRole("heading", { name: name }).should("exist");
  cy.findByText(description).should("exist");

  // Wait for the request to finish
  cy.intercept({
    method: "POST",
    url: "/prod/dashboard",
  }).as("createDashboardRequest");

  // Click the create button and wait
  cy.get("form").submit();
  cy.wait(["@createDashboardRequest"]);
}

export default createDashboard;
