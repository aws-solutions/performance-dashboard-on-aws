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
    let editTopicAreaLabelPage = topicAreaListingPage.goToEditTopicAreaLabel();

    const newName = "Category";
    const newNames = "Categories";

    editTopicAreaLabelPage.renameTopicAreaLabel(newName);
    editTopicAreaLabelPage.renameTopicAreasLabel(newNames);

    // Submit form and user is taken to the TopicAreaListingPage
    topicAreaListingPage = editTopicAreaLabelPage.save();
    topicAreaListingPage.waitUntilTopicAreasLoads();

    // Verify the new topic area names are present
    topicAreaListingPage.verifyTopicAreaLabel(newName, newNames);

    // Change the topic area label back
    editTopicAreaLabelPage = topicAreaListingPage.goToEditTopicAreaLabel();

    const oldName = "Topic Area";
    const oldNames = "Topic Areas";

    editTopicAreaLabelPage.renameTopicAreaLabel(oldName);
    editTopicAreaLabelPage.renameTopicAreasLabel(oldNames);
    // Submit form and user is taken to the TopicAreaListingPage
    topicAreaListingPage = editTopicAreaLabelPage.save();
    topicAreaListingPage.waitUntilTopicAreasLoads();

    // Verify the old topic area names are present
    topicAreaListingPage.verifyTopicAreaLabel(oldName, oldNames);
  });
});
