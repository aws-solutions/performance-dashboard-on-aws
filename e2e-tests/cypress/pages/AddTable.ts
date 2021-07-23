import EditDashboardPage from "./EditDashboard";

class AddTablePage {
  constructor() {
    cy.contains("Add table");
  }

  selectStaticDataset() {
    cy.findByLabelText("Static dataset").check({ force: true });
  }

  uploadDataset(fixture: string) {
    cy.contains("Drag file here or choose from folder");
    cy.findByLabelText("Static datasets").attachFile(fixture);
    cy.wait(200);
    cy.get("button").contains("Continue").click();
  }

  selectColumns() {
    cy.get("button").contains("Continue").click({ force: true });
  }

  fillTitle(title: string) {
    cy.findByLabelText("Table title").type(title);
  }

  fillSummary(summary: string) {
    cy.findByLabelText("Table summary - optional").type(summary);
  }

  verifyPreview(title: string, summary: string) {
    cy.get("table.usa-table--borderless").last().contains("Column 1");
    cy.get("table.usa-table--borderless").last().contains("Column 2");
    cy.get("table.usa-table--borderless").last().contains("Column 3");
    cy.get("table.usa-table--borderless").last().contains("Column 4");
    cy.get("table.usa-table--borderless").last().contains("Column 5");
    cy.findByRole("heading", { name: title }).should("exist");
    cy.contains(summary).should("exist");
  }

  submit(): EditDashboardPage {
    // Capture the http requests
    cy.intercept({
      method: "PUT",
      url: new RegExp(/\/public\/.+/),
    }).as("addTableRequest");

    cy.intercept({
      method: "POST",
      url: new RegExp(/\/prod\/dashboard\/.+\/widget/),
    }).as("createWidgetRequest");

    cy.intercept({
      method: "GET",
      url: new RegExp(/\/prod\/dashboard\/.+/),
    }).as("viewDashboardRequest");

    cy.intercept({
      method: "GET",
      url: new RegExp(/\/prod\/dashboard\/.+\/versions/),
    }).as("viewDashboardVersionsRequest");

    // Click the create button and wait for request to finish
    cy.get("button").contains("Add table").click();
    cy.wait([
      "@addTableRequest",
      "@addTableRequest",
      "@createWidgetRequest",
      "@viewDashboardRequest",
      "@viewDashboardVersionsRequest",
    ]);
    return new EditDashboardPage();
  }
}

export default AddTablePage;
