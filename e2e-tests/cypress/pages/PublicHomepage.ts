class PublicHomepage {
  visit() {
    cy.visit("/");
  }

  visitWithDummyData(fixture: string) {
    return cy.fixture(fixture).then((homepage: any) => {
      // Stub response
      cy.intercept("GET", "/prod/public/homepage", homepage);

      // Capture the http requests
      cy.intercept({
        method: "GET",
        url: "/prod/public/settings",
      }).as("publicSettingsRequest");

      cy.intercept({
        method: "GET",
        url: "/public/logo",
      }).as("logoRequest");

      // Direct to public homepage
      cy.visit("/");
      cy.wait(["@publicSettingsRequest", "@logoRequest"]);
    });
  }
}

export default PublicHomepage;
