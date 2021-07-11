import LoginPage from "../pages/Login";
import TopicAreaListingPage from "../pages/TopicAreaListing";
import * as Chance from "chance";

const random = new Chance();
let topicAreaListingPage: TopicAreaListingPage;

describe("Admin settings", () => {
  beforeEach(() => {
    const loginPage = new LoginPage();
    loginPage.visit();
    loginPage.loginAsAdmin();
  });

  it("can customize topic area label and change it back", () => {
    let topicAreaListingPage = new TopicAreaListingPage();
    topicAreaListingPage.visit();
    topicAreaListingPage.waitUntilTopicAreasTableLoads();
    let editTopicAreaLabelPage = topicAreaListingPage.goToEditTopicAreaLabel();

    // Change topic area label to Category and Categories
    const newName = "Category";
    const newNames = "Categories";
    editTopicAreaLabelPage.renameTopicAreaLabel(newName);
    editTopicAreaLabelPage.renameTopicAreasLabel(newNames);

    topicAreaListingPage = editTopicAreaLabelPage.submit();
    topicAreaListingPage.waitUntilTopicAreasTableLoads();

    topicAreaListingPage.verifyTopicAreaLabel(newName, newNames);

    // Customize topic area label to old name
    editTopicAreaLabelPage = topicAreaListingPage.goToEditTopicAreaLabel();

    const oldName = "Topic Area";
    const oldNames = "Topic Areas";
    editTopicAreaLabelPage.renameTopicAreaLabel(oldName);
    editTopicAreaLabelPage.renameTopicAreasLabel(oldNames);

    topicAreaListingPage = editTopicAreaLabelPage.submit();
    topicAreaListingPage.waitUntilTopicAreasTableLoads();

    topicAreaListingPage.verifyTopicAreaLabel(oldName, oldNames);
  });

  it("can create, edit, and delete topic area", () => {
    let topicAreaListingPage = new TopicAreaListingPage();
    topicAreaListingPage.visit();
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

  it("can edit publishing guidance", () => {
    let topicAreaListingPage = new TopicAreaListingPage();
    topicAreaListingPage.visit();
    let publishingGuidancePage = topicAreaListingPage.goToPublishingGuidance();

    const oldAcknowledgment =
      "I acknowledge that I have reviewed " +
      "the dashboard and it is ready to publish.";

    // Change to the new acknowledgment
    const newAcknowledgment = random.sentence();
    let editPublishingGuidancePage = publishingGuidancePage.goToEditPublishingGuidance();
    editPublishingGuidancePage.updateAcknowledgment(newAcknowledgment);
    publishingGuidancePage = editPublishingGuidancePage.submit();

    // Verify the new acknowledgment is present
    cy.contains("Publishing guidance successfully edited.");
    cy.contains(newAcknowledgment);

    // Change the acknowledgment back
    editPublishingGuidancePage = publishingGuidancePage.goToEditPublishingGuidance();
    editPublishingGuidancePage.updateAcknowledgment(oldAcknowledgment);
    publishingGuidancePage = editPublishingGuidancePage.submit();

    // Verify the old acknowledgment is present
    cy.contains("Publishing guidance successfully edited.");
    cy.contains(oldAcknowledgment);
  });
});
