import EditDashboardPage from "./EditDashboard";

class EditTextPage {
  constructor() {
    cy.contains("Edit text");
  }

  fillTitle(title: string) {
    cy.findByLabelText("Text title").clear().type(title);
  }

  fillTextContent(content: string) {
    cy.findByLabelText("Text").clear().type(content);
  }

  verifyPreview(title: string, content: string) {
    cy.findByRole("heading", { name: title }).should("exist");
    cy.get("p").findByText(content).should("exist");
  }

  submit(): EditDashboardPage {
    // Capture the http requests
    cy.intercept({
      method: "PUT",
      url: new RegExp(/\/prod\/dashboard\/.+\/widget\/.+/),
    }).as("updateWidgetRequest");

    cy.intercept({
      method: "GET",
      url: new RegExp(/\/prod\/dashboard\/.+/),
    }).as("viewDashboardRequest");

    cy.intercept({
      method: "GET",
      url: new RegExp(/\/prod\/dashboard\/.+\/versions/),
    }).as("viewDashboardVersionsRequest");

    // Click the Save button and wait for request to finish
    cy.get("button").contains("Save").click();
    cy.wait([
      "@updateWidgetRequest",
      "@viewDashboardRequest",
      "@viewDashboardVersionsRequest",
    ]);

    return new EditDashboardPage();
  }
}

export default EditTextPage;
