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

    // Direct to Dashboards page
    cy.get(selectors.navBar).get("a").contains("Dashboards").click();
    cy.wait(["@listDashboardsRequest"]);
  }

  goToCreateDashboard(): CreateDashboardPage {
    // Capture the http request
    cy.intercept({
      method: "GET",
      url: "/prod/topicarea",
    }).as("topicAreasRequest");

    // Direct to Create dashboard page
    cy.findByRole("button", { name: "Create dashboard" }).click();
    cy.wait(["@topicAreasRequest"]);

    cy.contains("Create dashboard");
    return new CreateDashboardPage();
  }

  deleteDashboard(dashboardName: string) {
    // Search for dashboard by its name
    cy.findByRole("searchbox").type(dashboardName);
    cy.get("form[role='search']").submit();

    // Select it by clicking the checkbox
    cy.get(`input[title="${dashboardName}"]`).click({
      force: true,
      multiple: true,
    });

    // Click delete from the actions dropdown menu
    cy.findByRole("button", { name: "Actions" }).click();
    cy.get("div").contains("Delete").click();

    // Wait for the requests to finish
    cy.intercept({
      method: "DELETE",
      url: "/prod/dashboard",
    }).as("deleteDashboardsRequest");

    // Accept modal confirmation prompt
    cy.findByRole("button", { name: "Delete" }).click();
    cy.wait(["@deleteDashboardsRequest"]);
  }
}

export default DashboardListingPage;
