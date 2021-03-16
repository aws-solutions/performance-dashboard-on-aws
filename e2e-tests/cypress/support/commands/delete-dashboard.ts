function deleteDraftDashboard(name: string) {
  cy.navigateTo("DashboardList");

  // search for dashboard by its name
  cy.findByRole("searchbox").type(name);
  cy.get("form[role='search']").submit();

  // select it by clicking the checkbox
  cy.get(`input[title="${name}"]`).click();

  // Click delete from the actions dropdown menu
  cy.findByRole("button", { name: "Actions" }).click();
  cy.get("div").contains("Delete").click();

  // Accept modal confirmation prompt
  cy.findByRole("button", { name: "Delete" }).click();

  // Verify success alert shows up
  cy.findByText(`${name} draft dashboard was successfully deleted`).should(
    "exist"
  );
}

export default deleteDraftDashboard;
