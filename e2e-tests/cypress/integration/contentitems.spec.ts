import * as Chance from "chance";
import EditDashboardPage from "pages/EditDashboard";
import CreateDashboardPage from "../pages/CreateDashboard";
import AddMetricsPage from "../pages/AddMetrics";
import AddTextPage from "../pages/AddText";
import AddChartPage from "../pages/AddChart";
import LoginPage from "../pages/Login";

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

    // Fill in content item details
    const textTitle = random.word();
    addTextPage.fillTitle(textTitle);

    const textContent = random.paragraph();
    addTextPage.fillTextContent(textContent);

    // Verify preview renders
    cy.findByRole("heading", { name: textTitle }).should("exist");
    cy.findByText(textContent).should("exist");

    // Submit form
    editDashboardPage = addTextPage.submit();

    // Verify new content item shows up
    cy.contains(`'${textTitle}' text has been successfully added.`);
    cy.contains(textTitle);

    // Delete the dashboard
    const dashboardListingPage = editDashboardPage.goToDashboardListing();
    dashboardListingPage.deleteDashboard(dashboardName);
  });

  // it("can add a Metrics content item to a dashboard", () => {
  //   const addContentItemPage = editDashboardPage.goToAddContentItem();
  //   addContentItemPage.selectMetricsContentItem();
  //   const addMetricsPage = addContentItemPage.clickContinue() as AddMetricsPage;

  //   // Step 1. Select create from scratch
  //   addMetricsPage.selectCreateFromScratch();
  //   const metricsTitle = random.word();
  //   addMetricsPage.fillTitle(metricsTitle);

  //   // Add new metric to the list
  //   const metricTitle = random.word();
  //   const metricValue = random.integer({ min: 100, max: 500 });
  //   addMetricsPage.addNewMetric(metricTitle, metricValue);

  //   // Verify new metric is added to the list
  //   cy.contains("Metric successfully added");
  //   cy.contains(metricTitle);
  //   cy.contains(metricValue);

  //   // Submit form
  //   editDashboardPage = addMetricsPage.submit();

  //   // Verify new content item shows up
  //   cy.contains(`Metrics '${metricsTitle}' have been successfully added`);
  //   cy.contains(metricsTitle);

  //   // Delete the dashboard
  //   const dashboardListingPage = editDashboardPage.goToDashboardListing();
  //   dashboardListingPage.deleteDashboard(dashboardName);
  // });

  // it("can add a Line Chart content item to a dashboard", () => {
  //   const addContentItemPage = editDashboardPage.goToAddContentItem();
  //   addContentItemPage.selectChartContentItem();
  //   const addChartPage = addContentItemPage.clickContinue() as AddChartPage;

  //   // Step 1. Choose static dataset
  //   addChartPage.selectStaticDataset();
  //   addChartPage.uploadDataset("linechart.csv");

  //   // Step 2. Select columns to display/hide
  //   addChartPage.selectColumns();

  //   // Step 3. Enter chart details
  //   const chartTitle = random.word();
  //   addChartPage.fillTitle(chartTitle);

  //   const chartSummary = random.sentence();
  //   addChartPage.fillSummary(chartSummary);

  //   // Verify Chart renders data from fixture linechart.csv
  //   cy.contains("Series 1");
  //   cy.contains("Series 2");
  //   cy.contains("Series 3");
  //   cy.contains("Series 4");
  //   cy.contains("Series 5");

  //   // Verify chart title and summary are also rendered in preview
  //   cy.contains(chartSummary).should("exist");
  //   cy.findByRole("heading", { name: chartTitle }).should("exist");

  //   // Submit form
  //   editDashboardPage = addChartPage.submit();

  //   // Verify new content item shows up
  //   cy.contains(`'${chartTitle}' chart has been successfully added.`);
  //   cy.contains(chartTitle);

  //   // Delete the dashboard
  //   const dashboardListingPage = editDashboardPage.goToDashboardListing();
  //   dashboardListingPage.deleteDashboard(dashboardName);
  // });
});
