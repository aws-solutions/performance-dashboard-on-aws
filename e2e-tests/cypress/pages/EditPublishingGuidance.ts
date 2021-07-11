import PublishingGuidancePage from "./PublishingGuidance";

class EditPublishingGuidancePage {
  updateAcknowledgment(newAcknowledgment: string) {
    cy.get("h1").contains("Edit publishing guidance");

    cy.get("textarea#publishingGuidance").clear().type(newAcknowledgment);
  }

  submit(): PublishingGuidancePage {
    // Capture the http requests
    cy.intercept({
      method: "PUT",
      url: "/prod/settings",
    }).as("updateAcknowledgmentRequest");

    cy.intercept({
      method: "GET",
      url: "/prod/settings",
    }).as("settingsRequest");

    // Direct user to Publishing Guidance page
    cy.get("form").submit();
    cy.wait([
      "@updateAcknowledgmentRequest",
      "@settingsRequest",
      "@settingsRequest",
    ]);

    return new PublishingGuidancePage();
  }
}

export default EditPublishingGuidancePage;
