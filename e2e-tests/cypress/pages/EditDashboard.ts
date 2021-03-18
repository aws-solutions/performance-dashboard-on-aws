import AddContentItemPage from "./AddContentItem";

class EditDashboardPage {
  waitUntilDashboardLoads(dashboardName: string) {
    cy.findByRole("heading", { name: dashboardName });
    cy.get("a").contains("Edit details");
  }

  goToAddContentItem(): AddContentItemPage {
    cy.get("button").contains("Add content item").click();
    return new AddContentItemPage();
  }
}

export default EditDashboardPage;
