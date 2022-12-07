/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

class PublishingGuidancePage {
    start() {
        // Capture the http request
        cy.intercept({
            method: "GET",
            url: "/prod/settings",
        }).as("settingsRequest");

        // Direct to Edit publishing guidance page
        cy.get("button").contains("Edit").click();
        cy.wait(["@settingsRequest"]);
    }

    updateAcknowledgment(newAcknowledgment: string) {
        cy.get("h1").contains("Edit publishing guidance");
        cy.get("textarea#publishingGuidance").clear().type(newAcknowledgment);
    }

    submit() {
        // Capture the http requests
        cy.intercept({
            method: "PUT",
            url: "/prod/settings",
        }).as("updateAcknowledgmentRequest");

        cy.intercept({
            method: "GET",
            url: "/prod/settings",
        }).as("settingsRequest");

        // Direct user to Publishing Guidance page
        cy.get("form").submit();
        cy.wait(["@updateAcknowledgmentRequest", "@settingsRequest", "@settingsRequest"]);
    }
}

export default PublishingGuidancePage;
