import AddContentItemPage from "./AddContentItem";
import DashboardListingPage from "./DashboardListing";

class EditDashboardPage {
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
