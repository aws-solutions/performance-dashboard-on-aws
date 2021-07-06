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
    cy.get("button").contains("Add metric").click();
    cy.findByLabelText("Metric title").type(title);
    cy.findByLabelText("Metric value").type(value.toString());
    cy.get("button").contains("Add metric").click();
  }

  submit(): EditDashboardPage {
    // Capture the http request
    cy.intercept({
      method: "POST",
      url: new RegExp(/\/prod\/dashboard\/.+\/widget/),
    }).as("createWidgetRequest");

    // Click the create button and wait for request to finish
    cy.get("button").contains("Add metrics").click();
    cy.wait(["@createWidgetRequest"]);

    return new EditDashboardPage();
  }
}

export default AddMetricsPage;
