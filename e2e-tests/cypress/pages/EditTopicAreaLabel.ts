import TopicAreaListingPage from "./TopicAreaListing";

class EditTopicAreaLabelPage {
  renameTopicAreaLabel(newName: string) {
    cy.findByLabelText("Rename single 'topic area'").clear().type(newName);
  }

  renameTopicAreasLabel(newNames: string) {
    cy.findByLabelText("Rename multiple 'topic areas'").clear().type(newNames);
  }

  save(): TopicAreaListingPage {
    cy.intercept({
      method: "PUT",
      url: "/prod/settings",
    }).as("editTopicAreaLabelRequest");

    cy.get("form").submit();
    cy.wait(["@editTopicAreaLabelRequest"]);

    return new TopicAreaListingPage();
  }
}

export default EditTopicAreaLabelPage;
