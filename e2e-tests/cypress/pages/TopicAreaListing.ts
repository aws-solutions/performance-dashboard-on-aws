/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import selectors from "../utils/selectors";
import EditTopicAreaLabelPage from "./EditTopicAreaLabel";
import CreateTopicAreaPage from "./CreateTopicArea";
import EditTopicAreaPage from "./EditTopicArea";

class TopicAreaListingPage {
  waitUntilTopicAreasTableLoads() {
    // Wait for the table to render
    cy.get("table").should("have.length", 1);
  }

  goToEditTopicAreaLabel(): EditTopicAreaLabelPage {
    cy.get("[data-testid='edittopicarealabel']").click();
    cy.contains("Edit topic area name");
    return new EditTopicAreaLabelPage();
  }

  goToCreateTopicArea(): CreateTopicAreaPage {
    cy.get("[data-testid='createtopicarea']").click();
    cy.get("h1").contains("Create new topic area");
    return new CreateTopicAreaPage();
  }

  goToEditTopicArea(topicAreaName: string): EditTopicAreaPage {
    // Search for the topic area by its name
    cy.get("input#search").type(topicAreaName);
    cy.get("form[role='search']").submit();

    // Select it by clicking the radio
    cy.findByLabelText(topicAreaName).click();

    // Capture the http request
    cy.intercept({
      method: "GET",
      url: new RegExp(/\/prod\/topicarea\/.+/),
    }).as("editTopicAreaNameRequest");

    // Edit user to edit topic area page
    cy.get("div.margin-y-3").contains("Edit").click();
    cy.wait(["@editTopicAreaNameRequest"]);

    return new EditTopicAreaPage();
  }

  deleteTopicArea(topicArea: string) {
    // Search for the topic area by its name
    cy.get("input#search").type(topicArea);
    cy.get("form[role='search']").submit();

    // Select it by clicking the radio
    cy.findByLabelText(topicArea).click();
    cy.get("div.margin-y-3").contains("Delete").click();

    // Capture the http requests
    cy.intercept({
      method: "DELETE",
      url: new RegExp("/prod/topicarea/"),
    }).as("deleteTopicAreaRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/topicarea",
    }).as("listTopicAreasRequest");

    // Accept modal confirmation prompt
    cy.findByRole("button", { name: "Delete" }).click();
    cy.wait(["@deleteTopicAreaRequest", "@listTopicAreasRequest"]);
  }

  verifyTopicAreaLabel(newName: string, newNames: string) {
    cy.contains("Topic area name was successfully edited.");
    cy.get("h1").contains(newNames);
    cy.get("ul.usa-sidenav__sublist").first().contains(newNames);
    cy.get("div.Markdown.undefined").first().contains(newName);
    cy.get("div.Markdown.undefined").last().contains(newNames);
    cy.get("h3").last().contains(newNames);
    cy.get("table").contains(newName);
    cy.get("button").contains(newName.toLowerCase());
  }

  verifyTopicArea(topicAreaName: string) {
    cy.get("input#search").type(topicAreaName);
    cy.get("form[role='search']").submit();
    cy.get("table").contains(topicAreaName);
    cy.get("input#search").clear();
    cy.get("form[role='search']").submit();
  }
}

export default TopicAreaListingPage;
