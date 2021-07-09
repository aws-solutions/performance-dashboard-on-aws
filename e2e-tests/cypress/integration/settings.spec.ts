import LoginPage from "../pages/Login";
import TopicAreaListingPage from "../pages/TopicAreaListing";
import * as Chance from "chance";

const random = new Chance();

describe("Admin settings", () => {
  beforeEach(() => {
    const loginPage = new LoginPage();
    loginPage.loginAsAdmin();
    loginPage.visit();
  });

  it("can customize topic area label and change it back", () => {
    let topicAreaListingPage = new TopicAreaListingPage();
    topicAreaListingPage.visit();

    // Customize topic area label to new name
    let editTopicAreaLabelPage = topicAreaListingPage.goToEditTopicAreaLabel();

    const newName = "Category";
    const newNames = "Categories";
    editTopicAreaLabelPage.renameTopicAreaLabel(newName);
    editTopicAreaLabelPage.renameTopicAreasLabel(newNames);

    topicAreaListingPage = editTopicAreaLabelPage.save();
    topicAreaListingPage.waitUntilTopicAreasLoads();

    topicAreaListingPage.verifyTopicAreaLabel(newName, newNames);

    // Customize topic area label to old name
    editTopicAreaLabelPage = topicAreaListingPage.goToEditTopicAreaLabel();

    const oldName = "Topic Area";
    const oldNames = "Topic Areas";
    editTopicAreaLabelPage.renameTopicAreaLabel(oldName);
    editTopicAreaLabelPage.renameTopicAreasLabel(oldNames);

    topicAreaListingPage = editTopicAreaLabelPage.save();
    topicAreaListingPage.waitUntilTopicAreasLoads();

    topicAreaListingPage.verifyTopicAreaLabel(oldName, oldNames);
  });

  it("can create, edit, and delete topic area", () => {
    let topicAreaListingPage = new TopicAreaListingPage();
    topicAreaListingPage.visit();

    // Create a new topic area
    let createTopicAreaPage = topicAreaListingPage.goToCreateTopicArea();

    const topicAreaName = random.word();
    createTopicAreaPage.createTopicArea(topicAreaName);
    topicAreaListingPage = createTopicAreaPage.submit();
    topicAreaListingPage.waitUntilTopicAreasLoads();

    cy.contains(`"${topicAreaName}" topic area successfully created`);
    topicAreaListingPage.verifyTopicArea(topicAreaName);

    // Edit the created topic area
    let editTopicAreaPage = topicAreaListingPage.goToEditTopicArea(
      topicAreaName
    );

    const newTopicAreaName = random.word();
    editTopicAreaPage.editTopicArea(newTopicAreaName);

    topicAreaListingPage = editTopicAreaPage.save();
    topicAreaListingPage.waitUntilTopicAreasLoads();

    cy.contains(`${newTopicAreaName} was successfully edited.`);
    topicAreaListingPage.verifyTopicArea(newTopicAreaName);

    // Delete the edited topic area
    topicAreaListingPage.deleteTopicArea(newTopicAreaName);
    topicAreaListingPage.waitUntilTopicAreasLoads();
    cy.contains(`"${newTopicAreaName}" topic area successfully deleted`);
  });
});
