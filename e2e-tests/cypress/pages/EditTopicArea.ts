import TopicAreaListingPage from "./TopicAreaListing";

class EditTopicAreaPage {
  editTopicArea(newName: string) {
    cy.get("[data-testid='EditTopicAreaForm'] input").clear().type(newName);
  }

  submit(): TopicAreaListingPage {
    // Capture the http requests
    cy.intercept({
      method: "PUT",
      url: new RegExp(/\/prod\/topicarea\/.+/),
    }).as("editTopicAreaRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/topicarea",
    }).as("listTopicAreasRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/settings",
    }).as("settingsRequest");

    // Direct user to topic areas page
    cy.get("form").submit();
    cy.wait([
      "@editTopicAreaRequest",
      "@listTopicAreasRequest",
      "@settingsRequest",
    ]);

    return new TopicAreaListingPage();
  }
}

export default EditTopicAreaPage;
