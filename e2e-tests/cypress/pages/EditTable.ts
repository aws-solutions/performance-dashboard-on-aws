/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import EditDashboardPage from "./EditDashboard";

class EditTablePage {
    constructor() {
        cy.contains("Edit table");
    }

    uploadDataset(oldFixture: string, newFixture: string) {
        cy.get("li.usa-button-group__item>button").eq(6).click();
        cy.contains(oldFixture);
        cy.findByLabelText("Static datasets").attachFile(newFixture);
        cy.wait(200);
        cy.get("button").contains("Continue").click();
    }

    selectColumns() {
        cy.get('input[name="Time"]').check({ force: true });
        cy.contains('Edit column "Time"');
        cy.findByLabelText("Hide from visualization").check({ force: true });
        cy.get("button").contains("Continue").click({ force: true });
    }

    fillTitle(title: string) {
        cy.findByLabelText("Table title*").clear().type(title);
    }

    fillSummary(summary: string) {
        cy.findByLabelText("Table summary (optional)").clear().type(summary);
    }

    verifyPreview(title: string, summary: string) {
        cy.get("table.usa-table--borderless").last().contains("Time").should("not.exist");
        cy.get("table.usa-table--borderless").last().contains("Series 1");
        cy.get("table.usa-table--borderless").last().contains("Series 2");
        cy.get("table.usa-table--borderless").last().contains("Series 3");
        cy.get("table.usa-table--borderless").last().contains("Series 4");
        cy.get("table.usa-table--borderless").last().contains("Series 5");
        cy.findByRole("heading", { name: title }).should("exist");
        cy.contains(summary).should("exist");
    }

    submit(): EditDashboardPage {
        // Capture the http requests
        cy.intercept({
            method: "PUT",
            url: new RegExp(/\/public\/.+/),
        }).as("updateTableRequest");

        cy.intercept({
            method: "PUT",
            url: new RegExp(/\/prod\/dashboard\/.+\/widget/),
        }).as("updateWidgetRequest");

        cy.intercept({
            method: "GET",
            url: new RegExp(/\/prod\/dashboard\/.+/),
        }).as("viewDashboardRequest");

        cy.intercept({
            method: "GET",
            url: new RegExp(/\/prod\/dashboard\/.+\/versions/),
        }).as("viewDashboardVersionsRequest");

        // Click the save button and wait for request to finish
        cy.get("button").contains("Save").click();
        cy.wait([
            "@updateTableRequest",
            "@updateTableRequest",
            "@updateWidgetRequest",
            "@viewDashboardRequest",
            "@viewDashboardVersionsRequest",
        ]);
        return new EditDashboardPage();
    }
}

export default EditTablePage;
