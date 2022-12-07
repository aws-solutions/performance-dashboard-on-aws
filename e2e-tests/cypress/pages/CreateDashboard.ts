/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import EditDashboardPage from "./EditDashboard";
import DashboardListingPage from "./DashboardListing";

class CreateDashboardPage {
    visit() {
        const dashboardListingPage = new DashboardListingPage();
        dashboardListingPage.visit();
        dashboardListingPage.goToCreateDashboard();
    }

    fillName(name: string) {
        cy.findByLabelText("Dashboard Name*").type(name);
    }

    fillDescription(description: string) {
        cy.findByLabelText("Description (optional)").type(description);
    }

    submit(): EditDashboardPage {
        // Capture the http requests
        cy.intercept({
            method: "POST",
            url: "/prod/dashboard",
        }).as("createDashboardRequest");

        cy.intercept({
            method: "GET",
            url: new RegExp(/\/prod\/dashboard\/.+/),
        }).as("viewDashboardRequest");

        cy.intercept({
            method: "GET",
            url: new RegExp(/\/prod\/dashboard\/.+\/versions/),
        }).as("viewDashboardVersionsRequest");

        // Click the create button and wait for request to finish
        cy.get("form").submit();
        cy.wait([
            "@createDashboardRequest",
            "@viewDashboardRequest",
            "@viewDashboardVersionsRequest",
        ]);

        // User is taken to the EditDashboardPage
        return new EditDashboardPage();
    }
}

export default CreateDashboardPage;
