import TopicAreaListingPage from "./TopicAreaListing";

class CreateTopicAreaPage {
  createTopicArea(topicAreaName: string) {
    cy.findByLabelText("Topic Area name").type(topicAreaName);
  }

  submit(): TopicAreaListingPage {
    cy.intercept({
      method: "POST",
      url: "prod/topicarea",
    }).as("createTopicAreaRequest");

    cy.get("form").submit();
    cy.wait(["@createTopicAreaRequest"]);

    return new TopicAreaListingPage();
  }
}

export default CreateTopicAreaPage;
