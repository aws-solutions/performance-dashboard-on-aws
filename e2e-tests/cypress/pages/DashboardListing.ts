import selectors from "../utils/selectors";
import CreateDashboardPage from "./CreateDashboard";

class DashboardListingPage {
  constructor() {}

  visit() {
    // Capture the http request
    cy.intercept({
      method: "GET",
      url: "/prod/dashboard",
    }).as("listDashboardsRequest");

    cy.get(selectors.navBar).get("a").contains("Dashboards").click();
    cy.wait(["@listDashboardsRequest"]);
  }

  goToCreateDashboard(): CreateDashboardPage {
    cy.findByRole("button", { name: "Create dashboard" }).click();
    cy.contains("Create dashboard");
    return new CreateDashboardPage();
  }

  deleteDashboard(dashboardName: string) {
    // search for dashboard by its name
    cy.findByRole("searchbox").type(dashboardName);
    cy.get("form[role='search']").submit();

    // select it by clicking the checkbox
    cy.get(`input[title="${dashboardName}"]`).click({
      force: true,
      multiple: true,
    });

    // Click delete from the actions dropdown menu
    cy.findByRole("button", { name: "Actions" }).click();
    cy.get("div").contains("Delete").click();

    // Wait for the request to finish
    cy.intercept({
      method: "DELETE",
      url: "/prod/dashboard",
    }).as("deleteDashboardsRequest");

    // Accept modal confirmation prompt
    cy.findByRole("button", { name: "Delete" }).click();
    cy.wait(["@deleteDashboardsRequest"]);

    // Verify success alert shows up
    cy.contains(`${dashboardName} draft dashboard was successfully deleted.`);
  }
}

export default DashboardListingPage;
