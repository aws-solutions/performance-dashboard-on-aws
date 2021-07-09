import TopicAreaListingPage from "./TopicAreaListing";

class EditTopicAreaPage {
  editTopicArea(newName: string) {
    cy.findByLabelText("Topic Area name").clear().type(newName);
  }

  save(): TopicAreaListingPage {
    cy.intercept({
      method: "PUT",
      url: "/prod/topicarea",
    }).as("editTopicAreaRequest");

    cy.get("form").submit();
    cy.wait(["@editTopicAreaRequest"]);

    return new TopicAreaListingPage();
  }
}

export default EditTopicAreaPage;
