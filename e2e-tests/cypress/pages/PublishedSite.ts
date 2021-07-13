class PublishedSitePage {
  startEditNavBar() {
    cy.get("button").contains("Edit").click();
  }

  updateNavBarTitle(title: string) {
    cy.findByLabelText("Title").clear().type(title);
  }

  updateNavBarEmail(email: string) {
    cy.findByLabelText("Contact email address").clear().type(email);
  }

  submitNavBar() {
    // Capture the http requests
    cy.intercept({
      method: "PUT",
      url: "/prod/settings",
    }).as("updateNavBarRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/settings",
    }).as("settingsRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/settings/homepage",
    }).as("homepageSettingsRequest");

    // Direct user to published site page
    cy.get("form").submit();
    cy.wait([
      "@updateNavBarRequest",
      "@updateNavBarRequest",
      "@settingsRequest",
      "@homepageSettingsRequest",
    ]);
  }

  verifyTitleEmail(title: string, email: string) {
    cy.get("div.Markdown.undefined").eq(0).contains(title);
    cy.get("div.usa-nav-container").contains(title);
    cy.get("div.Markdown.undefined").eq(1).contains(email);
  }

  startEditHomepage() {
    // Capture the http request
    cy.intercept({
      method: "GET",
      url: "/prod/settings/homepage",
    }).as("homepageSettingsRequest");

    // Direct user to Edit homepage content page
    cy.get("button").last().click();
    cy.wait(["@homepageSettingsRequest"]);
  }

  updateHomepageHeadline(headline: string) {
    cy.findByLabelText("Headline").clear().type(headline);
  }

  updateHomepageDescription(description: string) {
    cy.get("textarea#description").clear().type(description);
  }

  submitHomepage() {
    // Capture the http requests
    cy.intercept({
      method: "PUT",
      url: "/prod/settings/homepage",
    }).as("updateHomepageSettingsRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/settings/homepage",
    }).as("homepageSettingsRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/settings",
    }).as("settingsRequest");

    // Direct user to Published site page
    cy.get("form").submit();
    cy.wait([
      "@updateHomepageSettingsRequest",
      "@homepageSettingsRequest",
      "@settingsRequest",
    ]);
  }

  verifyHeadlineAndDescription(headline: string, description: string) {
    cy.get("div.Markdown.undefined").eq(2).contains(headline);
    cy.get("div.Markdown.undefined").eq(3).contains(description);

    cy.intercept({
      method: "GET",
      url: "/prod/public/homepage",
    }).as("publicHomepageRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/settings",
    }).as("settingsRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/settings/homepage",
    }).as("homepageSettingsRequest");

    // Visit the public homepage
    cy.visit("/");
    cy.wait(["@publicHomepageRequest", "@settingsRequest"]);

    cy.get("h1").contains(headline);
    cy.contains(description);

    // Direct user to Published site page
    cy.visit("/admin/settings/publishedsite");
    cy.wait([
      "@settingsRequest",
      "@settingsRequest",
      "@homepageSettingsRequest",
    ]);
    cy.contains(headline);
    cy.contains(description);
  }
}

export default PublishedSitePage;
