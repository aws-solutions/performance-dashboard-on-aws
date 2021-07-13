import EditDashboardPage from "./EditDashboard";

class AddTextPage {
  constructor() {
    cy.contains("Configure text content");
  }

  fillTitle(title: string) {
    cy.findByLabelText("Text title").type(title);
  }

  fillTextContent(content: string) {
    cy.findByLabelText("Text").type(content);
  }

  submit(): EditDashboardPage {
    // Capture the http requests
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
    cy.get("button").contains("Add text").click();
    cy.wait([
      "@createWidgetRequest",
      "@viewDashboardRequest",
      "@viewDashboardVersionsRequest",
    ]);

    return new EditDashboardPage();
  }
}

export default AddTextPage;
