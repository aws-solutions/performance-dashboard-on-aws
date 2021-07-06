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
    // Capture the http request
    cy.intercept({
      method: "POST",
      url: new RegExp(/\/prod\/dashboard\/.+\/widget/),
    }).as("createWidgetRequest");

    // Click the create button and wait for request to finish
    cy.get("button").contains("Add chart").click();
    cy.wait(["@createWidgetRequest"]);

    return new EditDashboardPage();
  }
}

export default AddChartPage;
