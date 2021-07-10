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
    cy.findByLabelText("Metrics title").type(title);
  }

  addNewMetric(title: string, value: number) {
    // Capture the http requests
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
      url: "/prod/dataset",
    }).as("datasetRequest");

    // Direct to Add Metric page
    cy.get("button").contains("Add metric").click();
    cy.wait(["@logoRequest", "@viewDashboardRequest"]);

    cy.findByLabelText("Metric title").type(title);
    cy.findByLabelText("Metric value").type(value.toString());

    // Direct to Add metrics page
    cy.get("button").contains("Add metric").click();
    cy.wait(["@logoRequest", "@viewDashboardRequest", "@datasetRequest"]);
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
    cy.get("button").contains("Add metrics").click();
    cy.wait([
      "@addMetricRequest",
      "@createWidgetRequest",
      "@logoRequest",
      "@viewDashboardRequest",
      "@viewDashboardVersionsRequest",
    ]);

    return new EditDashboardPage();
  }
}

export default AddMetricsPage;
