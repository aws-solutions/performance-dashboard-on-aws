import EditDashboardPage from "./EditDashboard";

class AddTextContentItem {
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
    cy.get("button").contains("Add text").click();
    return new EditDashboardPage();
  }
}

export default AddTextContentItem;
