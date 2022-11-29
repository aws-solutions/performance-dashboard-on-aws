/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import TopicAreaListingPage from "./TopicAreaListing";

class EditTopicAreaLabelPage {
  renameTopicAreaLabel(newName: string) {
    cy.findByLabelText("Rename single 'topic area'*").clear().type(newName);
  }

  renameTopicAreasLabel(newNames: string) {
    cy.findByLabelText("Rename multiple 'topic areas'*").clear().type(newNames);
  }

  submit(): TopicAreaListingPage {
    // Capture the http requests
    cy.intercept({
      method: "PUT",
      url: "/prod/settings",
    }).as("editTopicAreaLabelRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/topicarea",
    }).as("listTopicAreasRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/settings",
    }).as("settingsRequest");

    // Direct user to Topic areas page
    cy.get("form").submit();
    cy.wait([
      "@editTopicAreaLabelRequest",
      "@listTopicAreasRequest",
      "@settingsRequest",
    ]);

    return new TopicAreaListingPage();
  }
}

export default EditTopicAreaLabelPage;
