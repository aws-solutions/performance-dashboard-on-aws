import * as Chance from "chance";

const random = new Chance();

it("creates a dashboard successfully", () => {
  cy.login();

  // Generate random data to create dashboard
  const dashboardName = random.company();
  const description = random.sentence();
  cy.createDashboard(dashboardName, description);

  // Expect to see success alert
  cy.findByText(
    `"${dashboardName}" draft dashboard successfully created`
  ).should("exist");

  // Expect to see button to add content items
  cy.get("button").contains("Add content item").should("exist");

  // Clean up dashboard
  cy.deleteDraftDashboard(dashboardName);
});
