import EditDashboardPage from "./EditDashboard";

class AddMetricsPage {
  constructor() {
    cy.contains("Add metrics");
  }

  selectCreateFromScratch() {
    cy.findByLabelText("Create new").check({ force: true });
    cy.get("button").contains("Continue").click();
  }

  fillTitle(title: string) {
    cy.findByLabelText("Metrics title*").type(title);
  }

  addNewMetric(title: string, value: number) {
    // Capture the http requests
    cy.intercept({
      method: "GET",
      url: new RegExp(/\/prod\/dashboard\/.+/),
    }).as("viewDashboardRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/dataset",
    }).as("datasetRequest");

    // Direct to Add Metric page
    cy.get("button").contains("Add metric").click();
    cy.wait(["@viewDashboardRequest"]);

    cy.findByLabelText("Metric title*").type(title);
    cy.findByLabelText("Metric value*").type(value.toString());
    cy.get("select#percentage").select("Currency");
    cy.get("select#currency").select("Dollar $");
    cy.findByLabelText("Change over time (optional)").type("+10%");

    // Direct to Add metrics page
    cy.get("button").contains("Add metric").click();
    cy.wait(["@viewDashboardRequest", "@datasetRequest"]);
  }

  verifyPreview(title: string, value: number) {
    cy.contains("Metric successfully added");
    cy.get("div.height-card").contains(title);
    cy.get("div.height-card").contains("$".concat(value.toString()));
    cy.get("div.height-card").contains("10%");
  }

  submit(): EditDashboardPage {
    // Capture the http requests
    cy.intercept({
      method: "PUT",
      url: new RegExp(/\/public\/.+/),
    }).as("addMetricRequest");

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
    cy.get("button").contains("Add metrics").click();
    cy.wait([
      "@addMetricRequest",
      "@createWidgetRequest",
      "@viewDashboardRequest",
      "@viewDashboardVersionsRequest",
    ]);

    return new EditDashboardPage();
  }
}

export default AddMetricsPage;
