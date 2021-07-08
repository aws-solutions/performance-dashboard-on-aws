import { curryRight } from "cypress/types/lodash";
import TopicAreaListingPage from "./TopicAreaListing";

class EditTopicAreaLabelPage {
  renameTopicAreaLabel(newName: string) {
    cy.findByLabelText("Rename single 'topic area'").clear().type(newName);
  }

  renameTopicAreasLabel(newNames: string) {
    cy.findByLabelText("Rename multiple 'topic areas'").clear().type(newNames);
  }

  save(): TopicAreaListingPage {
    // Capture the http request
    cy.intercept({
      method: "PUT",
      url: "/prod/settings",
    }).as("editTopicAreaLabelRequest");

    // Click the save button and wait for request to finish
    cy.get("form").submit();
    cy.wait(["@editTopicAreaLabelRequest"]);

    // User is taken to the TopicAreaListingPage
    return new TopicAreaListingPage();
  }
}

export default EditTopicAreaLabelPage;
