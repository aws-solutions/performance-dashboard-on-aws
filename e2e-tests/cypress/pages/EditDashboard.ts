/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import AddContentItemPage from "./AddContentItem";
import DashboardListingPage from "./DashboardListing";
import EditTextPage from "./EditText";
import EditMetricsPage from "./EditMetrics";
import EditChartPage from "./EditChart";
import EditTablePage from "./EditTable";

class EditDashboardPage {
    goToAddContentItem(): AddContentItemPage {
        // Capture the http request
        cy.intercept({
            method: "GET",
            url: new RegExp(/\/prod\/dashboard\/.+/),
        }).as("addContentToDashboardRequest");

        // Direct to Add content item page
        cy.get("button").contains("Add content item").click();
        cy.wait(["@addContentToDashboardRequest"]);

        return new AddContentItemPage();
    }

    goToEditContentItem(
        contentType: string,
    ): EditTextPage | EditMetricsPage | EditChartPage | EditTablePage {
        // Click the create button and wait for request to finish
        cy.intercept({
            method: "GET",
            url: new RegExp(/\/prod\/dashboard\/.+/),
        }).as("viewDashboardRequest");

        cy.intercept({
            method: "GET",
            url: new RegExp(/\/prod\/dashboard\/.+\/widget\/.+/),
        }).as("viewWidgetRequest");

        cy.intercept({
            method: "GET",
            url: new RegExp(/\/public\/(?!.*logo)(?!.*favicon).+/),
        }).as("oldMetricRequest");

        cy.intercept({
            method: "GET",
            url: "/prod/dataset",
        }).as("datasetRequest");

        // Direct to relevant add content item page
        cy.get("div.grid-row").contains("Edit").click();

        switch (contentType) {
            case "Text":
                cy.wait(["@viewDashboardRequest", "@viewWidgetRequest"]);
                return new EditTextPage();
            case "Metrics":
                cy.wait(["@viewDashboardRequest", "@viewWidgetRequest", "@oldMetricRequest"]);
                return new EditMetricsPage();
            case "Chart":
                cy.wait([
                    "@viewDashboardRequest",
                    "@viewWidgetRequest",
                    "@oldMetricRequest",
                    "@datasetRequest",
                ]);
                return new EditChartPage();
            case "Table":
                cy.wait([
                    "@viewDashboardRequest",
                    "@viewWidgetRequest",
                    "@oldMetricRequest",
                    "@datasetRequest",
                ]);
                return new EditTablePage();
        }
    }

    copyContentItem() {
        // Capture the http requests
        cy.intercept({
            method: "POST",
            url: new RegExp(/\/prod\/dashboard\/.+\/widget\/.+/),
        }).as("createWidgetRequest");

        cy.intercept({
            method: "GET",
            url: new RegExp(/\/prod\/dashboard\/.+/),
        }).as("viewDashboardRequest");

        cy.get("div.grid-row").contains("Copy").click();
        cy.wait(["@createWidgetRequest", "@viewDashboardRequest"]);
    }

    deleteContentItem() {
        // Capture the http requests
        cy.intercept({
            method: "DELETE",
            url: new RegExp(/\/prod\/dashboard\/.+\/widget\/.+/),
        }).as("deleteWidgetRequest");

        cy.intercept({
            method: "GET",
            url: new RegExp(/\/prod\/dashboard\/.+/),
        }).as("viewDashboardRequest");

        cy.get("div.grid-row").contains("Delete").click();
        cy.get("div.ReactModal__Content").within(() => {
            cy.get("button").contains("Delete").click();
        });
        cy.wait(["@deleteWidgetRequest", "@viewDashboardRequest"]);
    }

    goToDashboardListing(): DashboardListingPage {
        // Capture the http request
        cy.intercept({
            method: "GET",
            url: "/prod/dashboard",
        }).as("listDashboardsRequest");

        cy.get("a").contains("Dashboards").click();
        cy.wait(["@listDashboardsRequest"]);
        return new DashboardListingPage();
    }
}

export default EditDashboardPage;
