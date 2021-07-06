import AddContentItemPage from "./AddContentItem";
import DashboardListingPage from "./DashboardListing";

class EditDashboardPage {
  waitUntilDashboardLoads(dashboardName: string) {
    cy.findByRole("heading", { name: dashboardName });
    cy.get("a").contains("Edit header");
  }

  goToAddContentItem(): AddContentItemPage {
    cy.get("button").contains("Add content item").click();
    return new AddContentItemPage();
  }

  goToDashboardListing(): DashboardListingPage {
    cy.get("a").contains("Dashboards").click();
    return new DashboardListingPage();
  }
}

export default EditDashboardPage;
