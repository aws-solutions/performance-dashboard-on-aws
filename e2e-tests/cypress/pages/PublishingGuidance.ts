import EditPublishingGuidancePage from "./EditPublishingGuidance";

class PublishingGuidancePage {
  goToEditPublishingGuidance(): EditPublishingGuidancePage {
    // Capture the http request
    cy.intercept({
      method: "GET",
      url: "/prod/settings",
    }).as("settingsRequest");

    // Direct to Edit publishing guidance page
    cy.get("button").contains("Edit").click();
    cy.wait(["@settingsRequest"]);

    return new EditPublishingGuidancePage();
  }
}

export default PublishingGuidancePage;
