import AddContentItemPage from "./AddContentItem";
import DashboardListingPage from "./DashboardListing";

class EditDashboardPage {
  goToAddContentItem(): AddContentItemPage {
    // Capture the http request
    cy.intercept({
      method: "GET",
      url: new RegExp(/\/prod\/dashboard\/.+/),
    }).as("addContentToDashboardRequest");

    // Direct to Add content item page
    cy.get("button").contains("Add content item").click();
    cy.wait(["@addContentToDashboardRequest"]);

    return new AddContentItemPage();
  }

  goToDashboardListing(): DashboardListingPage {
    // Capture the http request
    cy.intercept({
      method: "GET",
      url: "/prod/dashboard",
    }).as("listDashboardsRequest");

    cy.get("a").contains("Dashboards").click();
    cy.wait(["@listDashboardsRequest"]);
    return new DashboardListingPage();
  }
}

export default EditDashboardPage;
