/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import selectors from "../utils/selectors";
import CreateDashboardPage from "./CreateDashboard";

class DashboardListingPage {
  constructor() {}

  visit() {
    // Capture the http request
    cy.intercept({
      method: "GET",
      url: "/prod/dashboard",
    }).as("listDashboardsRequest");

    // Direct to Dashboards page
    cy.get(selectors.navBar).get("a").contains("Dashboards").click();
    cy.wait(["@listDashboardsRequest"]);
  }

  goToCreateDashboard(): CreateDashboardPage {
    // Capture the http request
    cy.intercept({
      method: "GET",
      url: "/prod/topicarea",
    }).as("topicAreasRequest");

    // Direct to Create dashboard page
    cy.contains("Create dashboard");
    cy.findByRole("button", { name: "Create dashboard" }).click();
    cy.wait(["@topicAreasRequest"]);

    cy.contains("Create dashboard");
    return new CreateDashboardPage();
  }

  deleteDashboard(dashboardName: string) {

    //Setup intercepts early
    cy.intercept({
      method: "DELETE",
      pathname: "/prod/dashboard",
    }).as("deleteDashboardsRequest");

    cy.intercept({
      method: "GET",
      pathname: "/prod/dashboard",
    }).as("listDashboardRequest");

    // Search for dashboard by its name
    cy.findByRole("searchbox").type(dashboardName);
    cy.get("form[role='search']").submit();

    // Select it by clicking the checkbox
    cy.get(`input[title="${dashboardName}"]`).click({
      force: true,
      multiple: true,
    });

    // Click delete from the actions dropdown menu
    cy.findByRole("button", { name: "Actions" }).click();
    cy.get("div").contains("Delete").click();

    // Accept modal confirmation prompt
    cy.findByRole("button", { name: "Delete" }).click();
    cy.wait(["@deleteDashboardsRequest", "@listDashboardRequest"]);
  }
}

export default DashboardListingPage;
