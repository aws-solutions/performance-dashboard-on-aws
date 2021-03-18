import * as Chance from "chance";
import EditDashboardPage from "pages/EditDashboard";
import CreateDashboardPage from "../pages/CreateDashboard";
import AddMetricsPage from "../pages/AddMetrics";
import AddTextPage from "../pages/AddText";
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
  });

  it("can add a Text content item to a dashboard", () => {
    editDashboardPage.waitUntilDashboardLoads(dashboardName);

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
    editDashboardPage.waitUntilDashboardLoads(dashboardName);
    cy.contains(`"${textTitle}" text has been successfully added`);
    cy.contains(textTitle);

    // Delete the dashboard
    const dashboardListingPage = editDashboardPage.goToDashboardListing();
    dashboardListingPage.deleteDashboard(dashboardName);
  });

  it("can add a Metrics content item to a dashboard", () => {
    editDashboardPage.waitUntilDashboardLoads(dashboardName);

    const addContentItemPage = editDashboardPage.goToAddContentItem();
    addContentItemPage.selectMetricsContentItem();
    const addMetricsPage = addContentItemPage.clickContinue() as AddMetricsPage;

    // Step 1. Select create from scratch
    addMetricsPage.selectCreateFromScratch();

    // Create from scratch and fill in content item details
    const metricsTitle = random.word();
    addMetricsPage.fillTitle(metricsTitle);

    // Add new metric to the list
    const metricTitle = random.word();
    const metricValue = random.integer({ min: 100, max: 500 });
    addMetricsPage.addNewMetric(metricTitle, metricValue);

    // Verify new metric is added to the list
    cy.contains("Metric successfully added");
    cy.contains(metricTitle);
    cy.contains(metricValue);

    // Submit form
    editDashboardPage = addMetricsPage.submit();

    // Verify new content item shows up
    editDashboardPage.waitUntilDashboardLoads(dashboardName);
    cy.contains(`"${metricsTitle}" metrics have been successfully added`);
    cy.contains(metricsTitle);

    // Delete the dashboard
    const dashboardListingPage = editDashboardPage.goToDashboardListing();
    dashboardListingPage.deleteDashboard(dashboardName);
  });
});
