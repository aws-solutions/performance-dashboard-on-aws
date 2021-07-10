import EditDashboardPage from "./EditDashboard";

class AddChartPage {
  constructor() {
    cy.contains("Add chart");
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
    cy.findByLabelText("Chart title").type(title);
  }

  fillSummary(summary: string) {
    cy.findByLabelText("Chart summary - optional").type(summary);
  }

  submit(): EditDashboardPage {
    // Capture the http requests
    cy.intercept({
      method: "PUT",
      url: new RegExp(/\/public\/.+/),
    }).as("addChartRequest");

    cy.intercept({
      method: "POST",
      url: new RegExp(/\/prod\/dashboard\/.+\/widget/),
    }).as("createWidgetRequest");

    cy.intercept({
      method: "GET",
      url: "/public/logo",
    }).as("logoRequest");

    cy.intercept({
      method: "GET",
      url: new RegExp(/\/prod\/dashboard\/.+/),
    }).as("viewDashboardRequest");

    cy.intercept({
      method: "GET",
      url: new RegExp(/\/prod\/dashboard\/.+\/versions/),
    }).as("viewDashboardVersionsRequest");

    // Click the create button and wait for request to finish
    cy.get("button").contains("Add chart").click();
    cy.wait([
      "@addChartRequest",
      "@createWidgetRequest",
      "@logoRequest",
      "@viewDashboardRequest",
      "@viewDashboardVersionsRequest",
    ]);
    return new EditDashboardPage();
  }
}

export default AddChartPage;
