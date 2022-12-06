/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

class PublicHomepage {
    visit() {
        cy.visit("/");
    }

    visitWithDummyData(fixture: string) {
        return cy.fixture(fixture).then((homepage: any) => {
            // Stub response
            cy.intercept("GET", "/prod/public/homepage", homepage);

            // Capture the http request
            cy.intercept({
                method: "GET",
                url: "/prod/public/settings",
            }).as("publicSettingsRequest");

            // Direct to public homepage
            cy.visit("/");
            cy.wait(["@publicSettingsRequest"]);
        });
    }
}

export default PublicHomepage;
