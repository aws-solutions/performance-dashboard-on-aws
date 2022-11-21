/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import TopicAreaListingPage from "./TopicAreaListing";

class CreateTopicAreaPage {
  createTopicArea(topicAreaName: string) {
    cy.get("[data-testid='CreateTopicAreaForm'] input").type(topicAreaName);
  }

  submit(): TopicAreaListingPage {
    // Capture the http requests
    cy.intercept({
      method: "POST",
      url: "prod/topicarea",
    }).as("createTopicAreaRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/topicarea",
    }).as("listTopicAreasRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/settings",
    }).as("settingsRequest");

    // Direct user to topic area page
    cy.get("form").submit();
    cy.wait([
      "@createTopicAreaRequest",
      "@listTopicAreasRequest",
      "@settingsRequest",
    ]);

    return new TopicAreaListingPage();
  }
}

export default CreateTopicAreaPage;
