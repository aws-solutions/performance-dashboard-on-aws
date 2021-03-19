class PublicHomepage {
  visit() {
    cy.visit("/");
  }

  visitWithDummyData(fixture: string) {
    return cy.fixture(fixture).then((homepage: any) => {
      cy.intercept("GET", "prod/public/homepage", homepage);
      cy.visit("/");
    });
  }
}

export default PublicHomepage;
