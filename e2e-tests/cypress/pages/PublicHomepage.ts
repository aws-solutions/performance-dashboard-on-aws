class PublicHomepage {
  visit() {
    cy.visit("/");
  }

  visitWithDummyData(fixture: string) {
    return cy.fixture(fixture).then((homepage: any) => {
      cy.intercept("GET", "/prod/public/homepage", homepage);

      cy.intercept({
        method: "GET",
        url: "/prod/public/settings",
      }).as("publicSettingsRequest");

      cy.intercept({
        method: "GET",
        url: "/public/logo",
      }).as("logoRequest");

      cy.visit("/");
      cy.wait(["@publicSettingsRequest", "@logoRequest"]);
    });
  }
}

export default PublicHomepage;
