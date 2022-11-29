/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import AddChartPage from "./AddChart";
import AddMetricsPage from "./AddMetrics";
import AddTextPage from "./AddText";
import AddTablePage from "./AddTable";

class AddContentItemPage {
  private selectedContentItem: "Text" | "Metrics" | "Chart" | "Table" | "Image";

  constructor() {
    cy.contains("Select the type of content you want to add");
  }

  selectTextContentItem() {
    cy.findByTestId("textRadioButton").check({ force: true });
    this.selectedContentItem = "Text";
  }

  selectMetricsContentItem() {
    cy.findByTestId("metricsRadioButton").check({ force: true });
    this.selectedContentItem = "Metrics";
  }

  selectChartContentItem() {
    cy.findByTestId("chartRadioButton").check({ force: true });
    this.selectedContentItem = "Chart";
  }

  selectTableContentItem() {
    cy.findByTestId("tableRadioButton").check({ force: true });
    this.selectedContentItem = "Table";
  }

  selectImageContentItem() {
    cy.findByTestId("imageRadioButton").check({ force: true });
    this.selectedContentItem = "Image";
  }

  clickContinue(): AddMetricsPage | AddTextPage | AddChartPage | AddTablePage {
    // Capture the http requests
    cy.intercept({
      method: "GET",
      url: new RegExp(/\/prod\/dashboard\/.+/),
    }).as("addSpecificContentToDashboardRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/dataset",
    }).as("datasetRequest");

    // Direct to specific content page
    cy.get("button").contains("Continue").click();

    switch (this.selectedContentItem) {
      case "Text":
        cy.wait(["@addSpecificContentToDashboardRequest"]);
        return new AddTextPage();
      case "Metrics":
        cy.wait(["@addSpecificContentToDashboardRequest", "@datasetRequest"]);
        return new AddMetricsPage();
      case "Chart":
        cy.wait(["@addSpecificContentToDashboardRequest", "@datasetRequest"]);
        return new AddChartPage();
      case "Table":
        cy.wait(["@addSpecificContentToDashboardRequest", "@datasetRequest"]);
        return new AddTablePage();
    }
  }
}

export default AddContentItemPage;
