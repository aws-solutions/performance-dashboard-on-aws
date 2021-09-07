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

  it("can add a Bar Chart content item to a dashboard", () => {
    const addContentItemPage = editDashboardPage.goToAddContentItem();
    addContentItemPage.selectChartContentItem();
    const addChartPage = addContentItemPage.clickContinue() as AddChartPage;

    // Choose static dataset
    addChartPage.selectStaticDataset();

    addChartPage.uploadDataset("samplebar.csv");

    // Select columns to display/hide
    cy.get("label[for='checkbox-header-1']").click();
    cy.get("#dataType").select("Number");
    cy.get("#numberType").select("Currency");
    cy.get("#currencyType").select("Euro €");
    cy.get("label[for='checkbox-header-1']").click();

    cy.get("label[for='checkbox-header-2']").click();
    cy.get("#dataType").select("Number");
    cy.get("#numberType").select("Currency");
    cy.get("#currencyType").select("Euro €");
    cy.get("label[for='checkbox-header-2']").click();

    //Continue
    cy.get('button:contains(Continue)').last().click();

    // Enter chart details
    const chartTitle = random.word();
    addChartPage.fillTitle(chartTitle);

    const chartSummary = random.sentence();
    addChartPage.fillSummary(chartSummary);

    cy.get("label[for='BarChart']").click();
    cy.get("label[for='dataLabels']").click();


    cy.get(".recharts-surface").contains("€80.00");
    cy.get(".recharts-surface").contains("€85.00");
    cy.get(".recharts-surface").contains("€94.00");
    cy.get(".recharts-surface").contains("€95.00");
    // Submit form
    editDashboardPage = addChartPage.submit();

    // Delete the dashboard
    const dashboardListingPage = editDashboardPage.goToDashboardListing();
    dashboardListingPage.deleteDashboard(dashboardName);
  }); 

  it("can add a Column Chart content item to a dashboard", () => {
    const addContentItemPage = editDashboardPage.goToAddContentItem();
    addContentItemPage.selectChartContentItem();
    const addChartPage = addContentItemPage.clickContinue() as AddChartPage;

    // Choose static dataset
    addChartPage.selectStaticDataset();

    addChartPage.uploadDataset("samplebar.csv");

    // Select columns to display/hide
    cy.get("label[for='checkbox-header-1']").click();
    cy.get("#dataType").select("Number");
    cy.get("#numberType").select("Currency");
    cy.get("#currencyType").select("Euro €");
    cy.get("label[for='checkbox-header-1']").click();

    cy.get("label[for='checkbox-header-2']").click();
    cy.get("#dataType").select("Number");
    cy.get("#numberType").select("Currency");
    cy.get("#currencyType").select("Euro €");
    cy.get("label[for='checkbox-header-2']").click();

    //Continue
    cy.get('button:contains(Continue)').last().click();

    // Enter chart details
    const chartTitle = random.word();
    addChartPage.fillTitle(chartTitle);

    const chartSummary = random.sentence();
    addChartPage.fillSummary(chartSummary);

    cy.get("label[for='ColumnChart']").click();
    cy.get("label[for='dataLabels']").click();


    cy.get(".recharts-surface").contains("€80.00");
    cy.get(".recharts-surface").contains("€85.00");
    cy.get(".recharts-surface").contains("€94.00");
    cy.get(".recharts-surface").contains("€95.00");
    // Submit form
    editDashboardPage = addChartPage.submit();

    // Delete the dashboard
    const dashboardListingPage = editDashboardPage.goToDashboardListing();
    dashboardListingPage.deleteDashboard(dashboardName);
  }); 
});