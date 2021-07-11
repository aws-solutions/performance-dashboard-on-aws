import LoginPage from "../pages/Login";
import SettingsPage from "../pages/Settings";
import * as Chance from "chance";

const random = new Chance();
let settingsPage: SettingsPage;

describe("Admin settings", () => {
  beforeEach(() => {
    const loginPage = new LoginPage();
    loginPage.visit();
    loginPage.loginAsAdmin();

    // Visit Settings landing page
    settingsPage = new SettingsPage();
    settingsPage.visit();
  });

  it("can customize topic area label and change it back", () => {
    let topicAreaListingPage = settingsPage.goToTopicAreas();
    topicAreaListingPage.waitUntilTopicAreasTableLoads();

    cy.get("div.Markdown.undefined")
      .first()
      .invoke("text")
      .then((name) => {
        cy.wrap(name).as("oldName");
      });

    cy.get("div.Markdown.undefined")
      .last()
      .invoke("text")
      .then((name) => {
        cy.wrap(name).as("oldNames");
      });

    // Change topic area label to Category and Categories
    let editTopicAreaLabelPage = topicAreaListingPage.goToEditTopicAreaLabel();

    const newName = "Category";
    const newNames = "Categories";
    editTopicAreaLabelPage.renameTopicAreaLabel(newName);
    editTopicAreaLabelPage.renameTopicAreasLabel(newNames);

    topicAreaListingPage = editTopicAreaLabelPage.submit();
    topicAreaListingPage.waitUntilTopicAreasTableLoads();

    topicAreaListingPage.verifyTopicAreaLabel(newName, newNames);

    // Customize topic area label to old name
    cy.get("@oldName").then((oldName) => {
      cy.get("@oldNames").then((oldNames) => {
        const oldNameString = <string>(<unknown>oldName);
        const oldNamesString = <string>(<unknown>oldNames);
        editTopicAreaLabelPage = topicAreaListingPage.goToEditTopicAreaLabel();

        editTopicAreaLabelPage.renameTopicAreaLabel(oldNameString);
        editTopicAreaLabelPage.renameTopicAreasLabel(oldNamesString);

        topicAreaListingPage = editTopicAreaLabelPage.submit();
        topicAreaListingPage.waitUntilTopicAreasTableLoads();

        topicAreaListingPage.verifyTopicAreaLabel(
          oldNameString,
          oldNamesString
        );
      });
    });
  });

  it("can create, edit, and delete topic area", () => {
    let topicAreaListingPage = settingsPage.goToTopicAreas();
    topicAreaListingPage.waitUntilTopicAreasTableLoads();

    // Create a new topic area
    let createTopicAreaPage = topicAreaListingPage.goToCreateTopicArea();

    const topicAreaName = random.word();
    createTopicAreaPage.createTopicArea(topicAreaName);
    topicAreaListingPage = createTopicAreaPage.submit();
    topicAreaListingPage.waitUntilTopicAreasTableLoads();

    cy.contains(`"${topicAreaName}" topic area successfully created`);
    topicAreaListingPage.verifyTopicArea(topicAreaName);

    // Edit the created topic area
    let editTopicAreaPage = topicAreaListingPage.goToEditTopicArea(
      topicAreaName
    );

    const newTopicAreaName = random.word();
    editTopicAreaPage.editTopicArea(newTopicAreaName);

    topicAreaListingPage = editTopicAreaPage.submit();
    topicAreaListingPage.waitUntilTopicAreasTableLoads();

    cy.contains(`${newTopicAreaName} was successfully edited.`);
    topicAreaListingPage.verifyTopicArea(newTopicAreaName);

    // Delete the edited topic area
    topicAreaListingPage.deleteTopicArea(newTopicAreaName);
    topicAreaListingPage.waitUntilTopicAreasTableLoads();
    cy.contains(`"${newTopicAreaName}" topic area successfully deleted`);
  });

  it("can customize publishing guidance and change it back", () => {
    let publishingGuidancePage = settingsPage.goToPublishingGuidance();

    cy.get("div.Markdown.undefined")
      .invoke("text")
      .then((acknowledgment) => {
        cy.wrap(acknowledgment).as("oldAcknowledgment");
      });

    // Change to the new acknowledgment
    const newAcknowledgment = random.sentence();
    publishingGuidancePage.start();
    publishingGuidancePage.updateAcknowledgment(newAcknowledgment);
    publishingGuidancePage.submit();

    // Verify the new acknowledgment is present
    cy.contains("Publishing guidance successfully edited.");
    cy.contains(newAcknowledgment);

    cy.get("@oldAcknowledgment").then((oldAcknowledgment) => {
      // Change the acknowledgment back
      publishingGuidancePage.start();
      publishingGuidancePage.updateAcknowledgment(
        <string>(<unknown>oldAcknowledgment)
      );
      publishingGuidancePage.submit();

      // Verify the old acknowledgment is present
      cy.contains("Publishing guidance successfully edited.");
      cy.contains(<string>(<unknown>oldAcknowledgment));
    });
  });
});
