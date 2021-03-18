import AddTextContentItemPage from "./AddTextContentItem";

class AddContentItemPage {
  constructor() {
    cy.contains("Select the type of content you want to add");
  }

  selectTextContentItem() {
    cy.findByLabelText("Text").check({ force: true });
  }

  selectMetricsContentItem() {
    cy.findByLabelText("Metrics").check({ force: true });
  }

  selectChartContentItem() {
    cy.findByLabelText("Chart").check({ force: true });
  }

  selectTableContentItem() {
    cy.findByLabelText("Table").check({ force: true });
  }

  selectImageContentItem() {
    cy.findByLabelText("Image").check({ force: true });
  }

  clickContinue(): AddTextContentItemPage {
    cy.get("button").contains("Continue").click();
    return new AddTextContentItemPage();
  }
}

export default AddContentItemPage;
