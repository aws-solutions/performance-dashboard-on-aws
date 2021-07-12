import selectors from "../utils/selectors";
import TopicAreaListingPage from "./TopicAreaListing";
import PublishingGuidancePage from "./PublishingGuidance";
import PublishedSitePage from "./PublishedSite";
import DateTimeFormatPage from "./DateTimeFormat";

class SettingsPage {
  visit() {
    // Capture the http requests
    cy.intercept({
      method: "GET",
      url: "/prod/topicarea",
    }).as("listTopicAreasRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/settings",
    }).as("settingsRequest");

    // Direct user to Settings/Topic areas page
    cy.get(selectors.navBar).get("a").contains("Settings").click();
    cy.wait([
      "@settingsRequest",
      "@settingsRequest",
      "@listTopicAreasRequest",
      "@listTopicAreasRequest",
    ]);
  }

  goToTopicAreas(): TopicAreaListingPage {
    // Capture the http requests
    cy.intercept({
      method: "GET",
      url: "/prod/topicarea",
    }).as("listTopicAreasRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/settings",
    }).as("settingsRequest");

    // Direct user to Publishing guidance settings page
    cy.get("a").contains("Topic Areas").click();
    cy.wait([
      "@settingsRequest",
      "@settingsRequest",
      "@listTopicAreasRequest",
      "@listTopicAreasRequest",
    ]);

    return new TopicAreaListingPage();
  }

  goToPublishingGuidance(): PublishingGuidancePage {
    // Capture the http request
    cy.intercept({
      method: "GET",
      url: "/prod/settings",
    }).as("settingsRequest");

    // Direct user to Publishing guidance settings page
    cy.get("a").contains("Publishing guidance").click();
    cy.wait(["@settingsRequest"]);

    return new PublishingGuidancePage();
  }

  goToPublishedSite(): PublishedSitePage {
    // Capture the http requests
    cy.intercept({
      method: "GET",
      url: "/prod/settings",
    }).as("settingsRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/settings/homepage",
    }).as("homepageSettingsRequest");

    // Direct user to Published site settings page
    cy.get("a").contains("Published site").click();
    cy.wait([
      "@homepageSettingsRequest",
      "@settingsRequest",
      "@settingsRequest",
    ]);

    return new PublishedSitePage();
  }

  goToDateTimeFormat(): DateTimeFormatPage {
    // Capture the http request
    cy.intercept({
      method: "GET",
      url: "/prod/settings",
    }).as("settingsRequest");

    // Direct user to Publishing guidance settings page
    cy.get("a").contains("Date and time format").click();
    cy.wait(["@settingsRequest"]);

    return new DateTimeFormatPage();
  }
}

export default SettingsPage;
