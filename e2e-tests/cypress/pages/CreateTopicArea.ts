import TopicAreaListingPage from "./TopicAreaListing";

class CreateTopicAreaPage {
  createTopicArea(topicAreaName: string) {
    cy.findByLabelText("Topic Area name").type(topicAreaName);
  }

  submit(): TopicAreaListingPage {
    // Capture the http requests
    cy.intercept({
      method: "POST",
      url: "prod/topicarea",
    }).as("createTopicAreaRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/topicarea",
    }).as("listTopicAreasRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/settings",
    }).as("settingsRequest");

    // Direct user to topic area page
    cy.get("form").submit();
    cy.wait([
      "@createTopicAreaRequest",
      "@listTopicAreasRequest",
      "@listTopicAreasRequest",
      "@settingsRequest",
      "@settingsRequest",
    ]);

    return new TopicAreaListingPage();
  }
}

export default CreateTopicAreaPage;
