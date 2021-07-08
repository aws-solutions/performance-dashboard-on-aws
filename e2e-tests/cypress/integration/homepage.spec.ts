import LoginPage from "../pages/Login";
import PublicHomepage from "../pages/PublicHomepage";

describe("Admin users", () => {
  it("are taken to the admin homepage after login", () => {
    const loginPage = new LoginPage();
    loginPage.loginAsAdmin();
    loginPage.visit();

    // Assert the welcome message is present
    cy.contains("Welcome to the Performance Dashboard");

    // Assert the 4 buttons are present
    cy.get("button").contains("Create dashboard");
    cy.get("button").contains("Manage users");
    cy.get("button").contains("View settings");
    cy.get("button").contains("View the published site");
  });
});

describe("Public users", () => {
  it("can see the homepage with dashboards grouped by topic area", () => {
    const publicHomepage = new PublicHomepage();
    publicHomepage.visitWithDummyData("homepage.json").then((homepage: any) => {
      cy.findByRole("searchbox").should("exist");

      // Verify site name and description are present
      cy.findByRole("heading", {
        name: "Performance Dashboard",
      }).should("exist");

      cy.findByText(
        "We make data open and accessible to provide " +
          "transparency and help improve digital services."
      ).should("exist");

      // Make sure each dashboard in the dummy data is also present
      cy.findByText("Gorgeous Cotton Gloves").should("exist");
      cy.findByText("Ergonomic Wooden Soap").should("exist");
      cy.findByText("Treutel Group").should("exist");

      // And the topic areas as well
      cy.findByText("Shoes and Sandals").should("exist");
      cy.findByText("Hauck LLC").should("exist");
      cy.findByText("Schaden and Sons").should("exist");
    });
  });
});
