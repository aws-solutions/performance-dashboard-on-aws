/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import * as Chance from "chance";
import EditDashboardPage from "../pages/EditDashboard";
import CreateDashboardPage from "../pages/CreateDashboard";
import AddMetricsPage from "../pages/AddMetrics";
import AddTextPage from "../pages/AddText";
import AddChartPage from "../pages/AddChart";
import AddTablePage from "../pages/AddTable";
import LoginPage from "../pages/Login";
import EditTextPage from "../pages/EditText";
import EditMetricsPage from "../pages/EditMetrics";
import EditChartPage from "../pages/EditChart";
import EditTablePage from "../pages/EditTable";

const random = new Chance();
let dashboardName: string;
let editDashboardPage: EditDashboardPage;

describe("Admin user", () => {
    beforeEach(() => {
        const loginPage = new LoginPage();
        loginPage.visit();
        loginPage.loginAsAdmin();

        const createDashboardPage = new CreateDashboardPage();
        createDashboardPage.visit();

        dashboardName = random.company();
        createDashboardPage.fillName(dashboardName);
        createDashboardPage.fillDescription(random.sentence());
        editDashboardPage = createDashboardPage.submit();

        cy.contains(`"${dashboardName}" draft dashboard successfully created.`);
    });

    it("can add a Text content item to a dashboard", () => {
        const addContentItemPage = editDashboardPage.goToAddContentItem();
        addContentItemPage.selectTextContentItem();
        const addTextPage = addContentItemPage.clickContinue() as AddTextPage;

        // Attempt to submit with empty title and content
        cy.get("button").contains("Add text").click();
        cy.contains("Resolve error(s) to add the text");
        cy.contains("Please specify a text title");
        cy.contains("Please specify text content");

        // Fill in content item details
        const textTitle = random.word();
        addTextPage.fillTitle(textTitle);

        const textContent = random.paragraph();
        addTextPage.fillTextContent(textContent);

        // Verify preview renders
        addTextPage.verifyPreview(textTitle, textContent);

        // Submit form
        editDashboardPage = addTextPage.submit();

        // Verify new content item shows up
        cy.contains(`'${textTitle}' text has been successfully added.`);
        cy.get("div.grid-row").contains(textTitle);

        // Edit text content item
        const editTextPage = editDashboardPage.goToEditContentItem("Text") as EditTextPage;
        const newTextTitle = random.word();
        editTextPage.fillTitle(newTextTitle);
        const newTextContent = random.paragraph();
        editTextPage.fillTextContent(newTextContent);
        editTextPage.verifyPreview(newTextTitle, newTextContent);
        editDashboardPage = editTextPage.submit();
        cy.contains(`'${newTextTitle}' text has been successfully edited.`);
        cy.get("div.grid-row").contains(newTextTitle);

        // Copy text content item
        editDashboardPage.copyContentItem();
        cy.contains(`Text '${newTextTitle}' was successfully copied.`);
        cy.get("div.grid-row").contains("(Copy) ".concat(newTextTitle));

        // Delete text content item
        editDashboardPage.deleteContentItem();
        cy.contains(`Text '${newTextTitle}' was successfully deleted.`);
        editDashboardPage.deleteContentItem();
        cy.get("div.grid-row").should("not.exist");

        // Delete the dashboard
        const dashboardListingPage = editDashboardPage.goToDashboardListing();
        dashboardListingPage.deleteDashboard(dashboardName);
    });

    it("can add a Metrics content item to a dashboard", () => {
        const addContentItemPage = editDashboardPage.goToAddContentItem();
        addContentItemPage.selectMetricsContentItem();
        const addMetricsPage = addContentItemPage.clickContinue() as AddMetricsPage;

        // Select create from scratch
        addMetricsPage.selectCreateFromScratch();
        cy.get("button").contains("Add metrics").click();
        cy.contains("Resolve error(s) to add the metrics");
        cy.contains("Please specify a content title");
        const metricsTitle = random.word();
        addMetricsPage.fillTitle(metricsTitle);
        cy.get("button").contains("Add metrics").click();
        cy.contains("Enter at least one metric to continue");

        // Add new metric to the list
        const metricTitle = random.word();
        const metricValue = random.integer({ min: 100, max: 500 });
        addMetricsPage.addNewMetric(metricTitle, metricValue);

        // Verify new metric is added to the list
        addMetricsPage.verifyPreview(metricTitle, metricValue);

        // Submit form
        editDashboardPage = addMetricsPage.submit();

        // Verify new content item shows up
        cy.contains(`Metrics '${metricsTitle}' have been successfully added`);
        cy.get("div.grid-row").contains(metricsTitle);

        // Edit metrics content item
        const editMetricsPage = editDashboardPage.goToEditContentItem("Metrics") as EditMetricsPage;
        const newMetricsTitle = random.word();
        editMetricsPage.fillTitle(newMetricsTitle);

        // Edit existing metric
        const updatedMetricValue = random.integer({ min: 100, max: 500 });
        editMetricsPage.editMetric(metricTitle, updatedMetricValue);
        cy.contains("Metric successfully edited.");

        // Delete existing metric from the list
        editMetricsPage.deleteMetric();

        // Add new metric to the list
        const newMetricTitle = random.word();
        const newMetricValue = random.integer({ min: 100, max: 500 });
        editMetricsPage.addNewMetric(newMetricTitle, newMetricValue);
        editMetricsPage.verifyPreview(newMetricTitle, newMetricValue);

        // Submit form
        editDashboardPage = editMetricsPage.submit();
        cy.contains(`Metrics '${newMetricsTitle}' have been successfully edited`);
        cy.get("div.grid-row").contains(newMetricsTitle);

        // Copy metrics content item
        editDashboardPage.copyContentItem();
        cy.contains(`Metrics '${newMetricsTitle}' was successfully copied.`);
        cy.get("div.grid-row").contains("(Copy) ".concat(newMetricsTitle));

        // Delete metrics content item
        editDashboardPage.deleteContentItem();
        cy.contains(`Metrics '${newMetricsTitle}' was successfully deleted.`);
        editDashboardPage.deleteContentItem();
        cy.get("div.grid-row").should("not.exist");

        // Delete the dashboard
        const dashboardListingPage = editDashboardPage.goToDashboardListing();
        dashboardListingPage.deleteDashboard(dashboardName);
    });

    it("can add a Line Chart content item to a dashboard", () => {
        const addContentItemPage = editDashboardPage.goToAddContentItem();
        addContentItemPage.selectChartContentItem();
        const addChartPage = addContentItemPage.clickContinue() as AddChartPage;

        // Choose static dataset
        addChartPage.selectStaticDataset();
        cy.findByLabelText("Static datasets").attachFile("chart_missing_header.csv");
        cy.contains(
            "Failed to upload file. Please make sure there are values for all column headers.",
        );
        addChartPage.uploadDataset("chart.csv");

        // Select columns to display/hide
        addChartPage.selectColumns();

        // Enter chart details
        const chartTitle = random.word();
        addChartPage.fillTitle(chartTitle);

        const chartSummary = random.sentence();
        addChartPage.fillSummary(chartSummary);

        // Verify Chart renders data from fixture chart.csv
        addChartPage.verifyPreview(chartTitle, chartSummary);

        // Submit form
        editDashboardPage = addChartPage.submit();

        // Verify new content item shows up
        cy.contains(`'${chartTitle}' chart has been successfully added.`);
        cy.get("div.grid-row").contains(chartTitle);

        // Edit chart content item
        const editChartPage = editDashboardPage.goToEditContentItem("Chart") as EditChartPage;
        editChartPage.uploadDataset("chart.csv", "table.csv");
        editChartPage.selectColumns();
        const newChartTitle = random.word();
        const newChartSummary = random.sentence();
        editChartPage.fillTitle(newChartTitle);
        editChartPage.fillSummary(newChartSummary);

        // Verify chart renders in preview
        editChartPage.verifyPreview(newChartTitle, newChartSummary);

        // Submit form
        editDashboardPage = editChartPage.submit(false);

        // Verify edited content item shows up
        cy.contains(`'${newChartTitle}' chart has been successfully edited.`);
        cy.get("div.grid-row").contains(newChartTitle);

        // Copy chart content item
        editDashboardPage.copyContentItem();
        cy.contains(`Line chart '${newChartTitle}' was successfully copied.`);
        cy.get("div.grid-row").contains("(Copy) ".concat(newChartTitle));

        // Delete chart content item
        editDashboardPage.deleteContentItem();
        cy.contains(`Line chart '${newChartTitle}' was successfully deleted.`);
        editDashboardPage.deleteContentItem();
        cy.get("div.grid-row").should("not.exist");

        // Delete the dashboard
        const dashboardListingPage = editDashboardPage.goToDashboardListing();
        dashboardListingPage.deleteDashboard(dashboardName);
    });

    it("can add a Table content item to a dashboard", () => {
        const addContentItemPage = editDashboardPage.goToAddContentItem();
        addContentItemPage.selectTableContentItem();
        const addTablePage = addContentItemPage.clickContinue() as AddTablePage;

        // Choose static dataset
        addTablePage.selectStaticDataset();
        addTablePage.uploadDataset("table.csv");

        // Select columns to display/hide
        addTablePage.selectColumns();

        // Enter table details
        const tableTitle = random.word();
        addTablePage.fillTitle(tableTitle);

        const tableSummary = random.sentence();
        addTablePage.fillSummary(tableSummary);

        // Verify Table renders data from fixture table.csv
        addTablePage.verifyPreview(tableTitle, tableSummary);

        // Submit form
        editDashboardPage = addTablePage.submit();

        // Verify new content item shows up
        cy.contains(`'${tableTitle}' table has been successfully added.`);
        cy.contains(tableTitle);

        // Edit table content item
        const editTablePage = editDashboardPage.goToEditContentItem("Table") as EditTablePage;
        editTablePage.uploadDataset("table.csv", "chart.csv");
        editTablePage.selectColumns();
        const newTableTitle = random.word();
        const newTableSummary = random.sentence();
        editTablePage.fillTitle(newTableTitle);
        editTablePage.fillSummary(newTableSummary);

        // Verify table renders in preview
        editTablePage.verifyPreview(newTableTitle, newTableSummary);

        // Submit form
        editDashboardPage = editTablePage.submit();

        // Verify edited content item shows up
        cy.contains(`'${newTableTitle}' table has been successfully edited.`);
        cy.get("div.grid-row").contains(newTableTitle);

        // Copy table content item
        editDashboardPage.copyContentItem();
        cy.contains(`Table '${newTableTitle}' was successfully copied.`);
        cy.get("div.grid-row").contains("(Copy) ".concat(newTableTitle));

        // Delete table content item
        editDashboardPage.deleteContentItem();
        cy.contains(`Table '${newTableTitle}' was successfully deleted.`);
        editDashboardPage.deleteContentItem();
        cy.get("div.grid-row").should("not.exist");

        // Delete the dashboard
        const dashboardListingPage = editDashboardPage.goToDashboardListing();
        dashboardListingPage.deleteDashboard(dashboardName);
    });
});
