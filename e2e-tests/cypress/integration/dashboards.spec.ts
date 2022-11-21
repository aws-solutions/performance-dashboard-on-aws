/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import * as Chance from "chance";
import DashboardListingPage from "../pages/DashboardListing";
import LoginPage from "../pages/Login";

const random = new Chance();

describe("Admin user", () => {
  beforeEach(() => {
    const loginPage = new LoginPage();
    loginPage.visit();
    loginPage.loginAsAdmin();
  });

  it("can create a new dashboard and delete it", () => {
    const dashboardListingPage = new DashboardListingPage();
    dashboardListingPage.visit();
    const createDashboardPage = dashboardListingPage.goToCreateDashboard();

    const dashboardName = random.company();
    const description = random.sentence();

    createDashboardPage.fillName(dashboardName);
    createDashboardPage.fillDescription(description);

    // Verify preview renders the dashboard name and description
    cy.findByRole("heading", { name: dashboardName }).should("exist");
    cy.findByText(description).should("exist");

    // Submit form and user is taken to the Edit Dashboard page
    let editDashboardPage = createDashboardPage.submit();

    // Verify success alert shows up
    cy.contains(`"${dashboardName}" draft dashboard successfully created.`);

    // Go back to the dashboard listing page and delete the dashboard
    dashboardListingPage.visit();
    cy.intercept({
      method: "GET",
      url: "/prod/dashboard",
    }).as("listDashboardsRequest");

    dashboardListingPage.deleteDashboard(dashboardName);
    cy.wait(["@listDashboardsRequest"]);

    // Verify success alert shows up
    cy.contains(`${dashboardName} draft dashboard was successfully deleted.`);
  });
});
