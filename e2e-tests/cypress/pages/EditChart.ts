import EditDashboardPage from "./EditDashboard";

class EditChartPage {
  constructor() {
    cy.contains("Edit chart");
  }

  uploadDataset(oldFixture: string, newFixture: string) {
    cy.get("li.usa-button-group__item>button").eq(6).click();
    cy.contains(oldFixture);
    cy.findByLabelText("Static datasets").attachFile(newFixture);
    cy.wait(200);
    cy.get("button").contains("Continue").click();
  }

  selectColumns() {
    cy.get('input[name="Column 2"]').check({ force: true });
    cy.contains('Edit column "Column 2"');
    cy.findByLabelText("Hide from visualization").check({ force: true });
    cy.get("button").contains("Continue").click({ force: true });
  }

  fillTitle(title: string) {
    cy.findByLabelText("Chart title").clear().type(title);
  }

  fillSummary(summary: string) {
    cy.findByLabelText("Chart summary - optional").clear().type(summary);
  }

  verifyPreview(title: string, summary: string) {
    cy.get("span.recharts-legend-item-text")
      .contains("Column 2")
      .should("not.exist");
    cy.get("span.recharts-legend-item-text").contains("Column 3");
    cy.get("span.recharts-legend-item-text").contains("Column 4");
    cy.get("span.recharts-legend-item-text").contains("Column 5");
    cy.findByRole("heading", { name: title }).should("exist");
    cy.contains(summary).should("exist");
  }

  submit(): EditDashboardPage {
    // Capture the http requests
    cy.intercept({
      method: "PUT",
      url: new RegExp(/\/public\/.+/),
    }).as("updateChartRequest");

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
      "@updateChartRequest",
      "@updateChartRequest",
      "@updateWidgetRequest",
      "@viewDashboardRequest",
      "@viewDashboardVersionsRequest",
    ]);
    return new EditDashboardPage();
  }
}

export default EditChartPage;
