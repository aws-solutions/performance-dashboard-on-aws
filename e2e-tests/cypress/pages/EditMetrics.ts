import EditDashboardPage from "./EditDashboard";

class EditMetricsPage {
  constructor() {
    cy.contains("Edit metrics");
  }

  fillTitle(title: string) {
    cy.findByLabelText("Metrics title").clear().type(title);
  }

  addNewMetric(title: string, value: number) {
    // Capture the http requests
    cy.intercept({
      method: "GET",
      url: new RegExp(/\/prod\/dashboard\/.+/),
    }).as("viewDashboardRequest");

    cy.intercept({
      method: "GET",
      url: new RegExp(/\/prod\/dashboard\/.+\/widget\/.+/),
    }).as("viewWidgetRequest");

    cy.intercept({
      method: "GET",
      url: new RegExp(/\/public\/(?!.*logo)(?!.*favicon).+/),
    }).as("oldMetricRequest");

    // Direct to Add Metric page
    cy.get("button").contains("Add metric").click();
    cy.wait(["@viewDashboardRequest"]);

    cy.findByLabelText("Metric title").type(title);
    cy.findByLabelText("Metric value").type(value.toString());

    // Direct to Add metrics page
    cy.get("button").contains("Add metric").click();
    cy.wait([
      "@viewDashboardRequest",
      "@viewWidgetRequest",
      "@oldMetricRequest",
    ]);
  }

  editMetric(title: string, value: number) {
    cy.intercept({
      method: "GET",
      url: new RegExp(/\/prod\/dashboard\/.+/),
    }).as("viewDashboardRequest");

    cy.intercept({
      method: "GET",
      url: new RegExp(/\/prod\/dashboard\/.+\/widget\/.+/),
    }).as("viewWidgetRequest");

    cy.intercept({
      method: "GET",
      url: new RegExp(/\/public\/(?!.*logo)(?!.*favicon).+/),
    }).as("oldMetricRequest");

    // Direct to Add Metric page
    cy.get("div.height-card").contains(title);
    cy.get("button").contains("Edit").click();
    cy.wait(["@viewDashboardRequest"]);

    cy.findByLabelText("Metric value").clear().type(value.toString());

    // Direct to Add metrics page
    cy.get("button").contains("Save").click();
    cy.wait([
      "@viewDashboardRequest",
      "@viewWidgetRequest",
      "@oldMetricRequest",
    ]);
  }

  deleteMetric() {
    cy.get("button").contains("Delete").click();
  }

  verifyPreview(title: string, value: number) {
    cy.contains("Metric successfully added");
    cy.get("div.height-card").contains(title);
    cy.get("div.height-card").contains(value.toString());
  }

  submit(): EditDashboardPage {
    // Capture the http requests
    cy.intercept({
      method: "PUT",
      url: new RegExp(/\/public\/.+/),
    }).as("updateMetricRequest");

    cy.intercept({
      method: "PUT",
      url: new RegExp(/\/prod\/dashboard\/.+\/widget/),
    }).as("updateWidgetRequest");

    cy.intercept({
      method: "GET",
      url: new RegExp(/\/prod\/dashboard\/.+/),
    }).as("viewDashboardRequest");

    cy.intercept({
      method: "GET",
      url: new RegExp(/\/prod\/dashboard\/.+\/versions/),
    }).as("viewDashboardVersionsRequest");

    // Click the save button and wait for request to finish
    cy.get("button").contains("Save").click();
    cy.wait([
      "@updateMetricRequest",
      "@updateWidgetRequest",
      "@viewDashboardRequest",
      "@viewDashboardVersionsRequest",
    ]);

    return new EditDashboardPage();
  }
}

export default EditMetricsPage;
