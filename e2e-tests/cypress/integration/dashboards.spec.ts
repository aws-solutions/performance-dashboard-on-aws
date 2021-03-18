import * as Chance from "chance";
import DashboardListingPage from "../pages/DashboardListing";
import LoginPage from "../pages/Login";

const random = new Chance();

describe("Admin user", () => {
  it("creates a new dashboard with content items and publishes it", () => {
    /**
     * Login as admin user
     */
    const loginPage = new LoginPage();
    loginPage.visit();
    loginPage.loginAsAdmin();

    /**
     * Create dashboard
     */
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

    /**
     * Add Text content item
     */
    editDashboardPage.waitUntilDashboardLoads(dashboardName);
    const addContentItemPage = editDashboardPage.goToAddContentItem();
    addContentItemPage.selectTextContentItem();
    const addTextContentItemPage = addContentItemPage.clickContinue();

    const textTitle = random.word();
    const textContent = random.paragraph();
    addTextContentItemPage.fillTitle(textTitle);
    addTextContentItemPage.fillTextContent(textContent);

    // Verify preview renders
    cy.findByRole("heading", { name: textTitle }).should("exist");
    cy.findByText(textContent).should("exist");

    editDashboardPage = addTextContentItemPage.submit();

    // Verify new content item shows up
    editDashboardPage.waitUntilDashboardLoads(dashboardName);
    cy.contains(`"${textTitle}" text has been successfully added`);
    cy.contains(textTitle);
  });
});
