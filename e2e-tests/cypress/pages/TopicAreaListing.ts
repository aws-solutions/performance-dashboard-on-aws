import selectors from "../utils/selectors";
import EditTopicAreaLabelPage from "./EditTopicAreaLabel";

class TopicAreaListingPage {
  constructor() {}

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

    cy.get(selectors.navBar).get("a").contains("Settings").click();
    cy.wait(["@listTopicAreasRequest", "@settingsRequest"]);
  }

  goToEditTopicAreaLabel(): EditTopicAreaLabelPage {
    cy.get("button").contains("Edit").click();
    cy.contains("Edit topic area name");
    return new EditTopicAreaLabelPage();
  }

  waitUntilTopicAreasLoads() {
    // Capture the http request
    cy.intercept({
      method: "GET",
      url: "/prod/topicarea",
    }).as("listTopicAreasRequest");

    cy.wait(["@listTopicAreasRequest"]);
    cy.get("table").should("have.length", 1);
  }

  verifyTopicAreaLabel(newName: string, newNames: string) {
    cy.contains("Topic area name was successfully edited.");
    cy.get("h1").contains(newNames);
    cy.get("ul.usa-sidenav__sublist").first().contains(newNames);
    cy.get("div.Markdown.undefined").first().contains(newName);
    cy.get("div.Markdown.undefined").last().contains(newNames);
    cy.get("h3").last().contains(newNames);
    cy.get("table").contains(newName);
    cy.get("button").contains(newName.toLowerCase());
  }
}

export default TopicAreaListingPage;
