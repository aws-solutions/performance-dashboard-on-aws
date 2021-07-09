import EditDashboardPage from "./EditDashboard";
import DashboardListingPage from "./DashboardListing";

class CreateDashboardPage {
  visit() {
    const dashboardListingPage = new DashboardListingPage();
    dashboardListingPage.visit();
    dashboardListingPage.goToCreateDashboard();
  }

  fillName(name: string) {
    cy.findByLabelText("Dashboard Name").type(name);
  }

  fillDescription(description: string) {
    cy.findByLabelText("Description - optional").type(description);
  }

  submit(): EditDashboardPage {
    // Capture the http requests
    cy.intercept({
      method: "POST",
      url: "/prod/dashboard",
    }).as("createDashboardRequest");

    cy.intercept({
      method: "GET",
      url: "/public/logo",
    }).as("logoRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/dashboard",
    }).as("listDashboardRequest");

    // Click the create button and wait for request to finish
    cy.get("form").submit();
    cy.wait([
      "@createDashboardRequest",
      "@listDashboardRequest",
      "@logoRequest",
    ]);

    // User is taken to the EditDashboardPage
    return new EditDashboardPage();
  }
}

export default CreateDashboardPage;
