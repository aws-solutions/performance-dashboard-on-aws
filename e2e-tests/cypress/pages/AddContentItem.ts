import AddMetricsPage from "./AddMetrics";
import AddTextPage from "./AddText";

class AddContentItemPage {
  private selectedContentItem: "Text" | "Metrics" | "Chart";

  constructor() {
    cy.contains("Select the type of content you want to add");
  }

  selectTextContentItem() {
    cy.findByLabelText("Text").check({ force: true });
    this.selectedContentItem = "Text";
  }

  selectMetricsContentItem() {
    cy.findByLabelText("Metrics").check({ force: true });
    this.selectedContentItem = "Metrics";
  }

  selectChartContentItem() {
    cy.findByLabelText("Chart").check({ force: true });
    this.selectedContentItem = "Chart";
  }

  selectTableContentItem() {
    cy.findByLabelText("Table").check({ force: true });
  }

  selectImageContentItem() {
    cy.findByLabelText("Image").check({ force: true });
  }

  clickContinue(): AddMetricsPage | AddTextPage {
    cy.get("button").contains("Continue").click();
    switch (this.selectedContentItem) {
      case "Text":
        return new AddTextPage();
      case "Metrics":
        return new AddMetricsPage();
    }
  }
}

export default AddContentItemPage;
