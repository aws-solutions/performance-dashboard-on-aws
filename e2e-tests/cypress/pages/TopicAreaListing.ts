import selectors from "../utils/selectors";
import EditTopicAreaLabelPage from "./EditTopicAreaLabel";
import CreateTopicAreaPage from "./CreateTopicArea";
import EditTopicAreaPage from "./EditTopicArea";

class TopicAreaListingPage {
  constructor() {}

  visit() {
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

  goToCreateTopicArea(): CreateTopicAreaPage {
    cy.get("button").contains("Create new topic area").click();
    cy.contains("Create new topic area");
    return new CreateTopicAreaPage();
  }

  waitUntilTopicAreasLoads() {
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

  verifyTopicArea(topicArea: string) {
    cy.get("input#search").type(topicArea);
    cy.get("form[role='search']").submit();
    cy.get("table").contains(topicArea);
    cy.get("input#search").clear();
    cy.get("form[role='search']").submit();
  }

  goToEditTopicArea(topicArea: string): EditTopicAreaPage {
    // search for the topic area by its name
    cy.get("input#search").type(topicArea);
    cy.get("form[role='search']").submit();

    // select it by clicking the radio
    cy.findByLabelText(topicArea).click();
    cy.get("div.margin-y-3").contains("Edit").click();

    return new EditTopicAreaPage();
  }

  deleteTopicArea(topicArea: string) {
    // search for the topic area by its name
    cy.get("input#search").type(topicArea);
    cy.get("form[role='search']").submit();

    // select it by clicking the radio
    cy.findByLabelText(topicArea).click();
    cy.get("div.margin-y-3").contains("Delete").click();

    // wait for the request to finish
    cy.intercept({
      method: "DELETE",
      url: "/prod/topicarea",
    }).as("deleteTopicAreaRequest");

    // accept modal confirmation prompt
    cy.findByRole("button", { name: "Delete" }).click();
    cy.wait("@deleteTopicAreaRequest");
  }
}

export default TopicAreaListingPage;
