import API from "@aws-amplify/api";
import Auth from "@aws-amplify/auth";
import BackendService from "../BackendService";
import { Widget } from "../../models";

jest.mock("@aws-amplify/api");
jest.mock("@aws-amplify/auth");

beforeEach(() => {
  const getJwtToken = jest.fn().mockReturnValue("eyJhbGciOiJIUzI1NiIsInR5c");
  const getIdToken = jest.fn().mockReturnValue({ getJwtToken });
  Auth.currentSession = jest.fn().mockReturnValue({ getIdToken });

  // Reset mocks before each test
  API.put = jest.fn();
  API.del = jest.fn();
  API.post = jest.fn();
  API.get = jest.fn();
});

test("fetchDashboardById makes a GET request to dashboard API", async () => {
  const dashboardId = "123";

  await BackendService.fetchDashboardById(dashboardId);
  expect(API.get).toHaveBeenCalledWith(
    "BackendApi",
    `dashboard/${dashboardId}`,
    expect.anything()
  );
});

test("fetchPublicHomepageWithQuery makes a GET request to homepage API", async () => {
  const query = "Hello";
  await BackendService.fetchPublicHomepageWithQuery(query);
  expect(API.get).toHaveBeenCalledWith(
    "BackendApi",
    `public/search?q=${query}`,
    expect.anything()
  );
});

test("createDashboard should make a POST request with payload", async () => {
  const name = "One Pretty Dashboard";
  const description = "Alexa, how is the weather?";
  const topicAreaId = "xyz";

  await BackendService.createDashboard(name, topicAreaId, description);

  expect(API.post).toHaveBeenCalledWith(
    "BackendApi",
    "dashboard",
    expect.objectContaining({
      body: {
        name,
        topicAreaId,
        description,
      },
    })
  );
});

test("editDashboard should make a PUT request with payload", async () => {
  const dashboardId = "123";
  const name = "One Pretty Dashboard";
  const description = "Alexa, how is the weather?";
  const topicAreaId = "xyz";
  const displayTableOfContents = false;

  const updatedAt = new Date("2020-09-17T21:01:00.780Z");

  await BackendService.editDashboard(
    dashboardId,
    name,
    topicAreaId,
    displayTableOfContents,
    description,
    updatedAt
  );

  expect(API.put).toHaveBeenCalledWith(
    "BackendApi",
    `dashboard/${dashboardId}`,
    expect.objectContaining({
      body: {
        name,
        topicAreaId,
        displayTableOfContents,
        description,
        updatedAt,
      },
    })
  );
});

test("publishDashboard should make a PUT request with payload", async () => {
  const dashboardId = "123";
  const updatedAt = new Date("2020-09-17T21:01:00.780Z");
  const releaseNotes = "Made changes to the revenue metrics";
  const friendlyURL = "bananas";

  await BackendService.publishDashboard(
    dashboardId,
    updatedAt,
    releaseNotes,
    friendlyURL
  );

  expect(API.put).toHaveBeenCalledWith(
    "BackendApi",
    `dashboard/${dashboardId}/publish`,
    expect.objectContaining({
      body: {
        updatedAt,
        releaseNotes,
        friendlyURL,
      },
    })
  );
});

test("deleteDashboards makes a DELETE request to dashboard API", async () => {
  const dashboardIds = ["123", "456"];

  await BackendService.deleteDashboards(dashboardIds);
  expect(API.del).toHaveBeenCalledWith(
    "BackendApi",
    `dashboard?ids=123,456`,
    expect.anything()
  );
});

test("createTopicArea should make a POST request with payload", async () => {
  const name = "Topic Area 1";

  await BackendService.createTopicArea(name);

  expect(API.post).toHaveBeenCalledWith(
    "BackendApi",
    "topicarea",
    expect.objectContaining({
      body: {
        name,
      },
    })
  );
});

test("deleteTopicArea makes a DELETE request to dashboard API", async () => {
  const topicAreaId = "123";

  await BackendService.deleteTopicArea(topicAreaId);
  expect(API.del).toHaveBeenCalledWith(
    "BackendApi",
    `topicarea/123`,
    expect.anything()
  );
});

test("fetchWidgetById makes a GET request to widget API", async () => {
  const dashboardId = "123";
  const widgetId = "abc";

  await BackendService.fetchWidgetById(dashboardId, widgetId);
  expect(API.get).toHaveBeenCalledWith(
    "BackendApi",
    `dashboard/${dashboardId}/widget/${widgetId}`,
    expect.anything()
  );
});

test("deleteWidget makes a DELETE request to widget API", async () => {
  const dashboardId = "123";
  const widgetId = "abc";

  await BackendService.deleteWidget(dashboardId, widgetId);
  expect(API.del).toHaveBeenCalledWith(
    "BackendApi",
    `dashboard/${dashboardId}/widget/${widgetId}`,
    expect.anything()
  );
});

test("setWidgetOrder makes a PUT request to widget API", async () => {
  const dashboardId = "123";
  const updatedAt = new Date("2020-09-17T21:01:00.780Z");
  const widgets: Array<Widget> = [
    {
      id: "123",
      name: "Apple",
      order: 1,
      widgetType: "Table",
      dashboardId: "abc",
      updatedAt,
      showTitle: true,
      content: {},
    },
  ];

  await BackendService.setWidgetOrder(dashboardId, widgets);
  expect(API.put).toHaveBeenCalledWith(
    "BackendApi",
    `dashboard/${dashboardId}/widgetorder`,
    expect.objectContaining({
      body: {
        widgets: [
          {
            id: "123",
            updatedAt,
            order: 1,
            content: {},
            section: undefined,
          },
        ],
      },
    })
  );
});

test("fetchPublicHomepage makes a GET request to widget API", async () => {
  await BackendService.fetchPublicHomepage();
  expect(API.get).toHaveBeenCalledWith("BackendApi", "public/homepage", {});
});

test("fetchHomepage makes a GET request to widget API", async () => {
  await BackendService.fetchHomepage();
  expect(API.get).toHaveBeenCalledWith(
    "BackendApi",
    "settings/homepage",
    expect.anything()
  );
});

test("editHomepage should make a PUT request with payload", async () => {
  const title = "123";
  const description = "description test";
  const updatedAt = new Date("2020-09-17T21:01:00.780Z");

  await BackendService.editHomepage(title, description, updatedAt);

  expect(API.put).toHaveBeenCalledWith(
    "BackendApi",
    "settings/homepage",
    expect.objectContaining({
      body: {
        title,
        description,
        updatedAt,
      },
    })
  );
});

test("fetchPublicDashboard makes a GET request to public API", async () => {
  await BackendService.fetchPublicDashboard("123");
  expect(API.get).toHaveBeenCalledWith(
    "BackendApi",
    "public/dashboard/123",
    {}
  );
});

test("createDraft makes a POST request to dashboard API", async () => {
  await BackendService.createDraft("123");
  expect(API.post).toBeCalledWith(
    "BackendApi",
    "dashboard/123",
    expect.anything()
  );
});

test("publishPending makes a PUT request to dashboard API", async () => {
  const lastUpdatedAt = new Date();
  const releaseNotes = "Lorem ipsum";
  await BackendService.publishPending("123", lastUpdatedAt, releaseNotes);
  expect(API.put).toBeCalledWith(
    "BackendApi",
    "dashboard/123/publishpending",
    expect.objectContaining({
      body: {
        updatedAt: lastUpdatedAt,
        releaseNotes: releaseNotes,
      },
    })
  );
});

test("publishPending returns the updated dashboard", async () => {
  const lastUpdatedAt = new Date();
  const updatedDashboard = {};
  API.put = jest.fn().mockReturnValueOnce(updatedDashboard);

  const dashboard = await BackendService.publishPending("123", lastUpdatedAt);
  expect(dashboard).toBe(updatedDashboard);
});

test("moveToDraft makes a PUT request to dashboard API", async () => {
  const lastUpdatedAt = new Date();
  await BackendService.moveToDraft("123", lastUpdatedAt);
  expect(API.put).toBeCalledWith(
    "BackendApi",
    "dashboard/123/draft",
    expect.objectContaining({
      body: {
        updatedAt: lastUpdatedAt,
      },
    })
  );
});

test("fetchDashboardVersions makes a GET request to dashboard API", async () => {
  await BackendService.fetchDashboardVersions("123");
  expect(API.get).toBeCalledWith(
    "BackendApi",
    "dashboard/123/versions",
    expect.anything()
  );
});

test("fetchTopicAreaById makes a GET request to topicarea API", async () => {
  const topicAreaId = "123";
  await BackendService.fetchTopicAreaById(topicAreaId);
  expect(API.get).toHaveBeenCalledWith(
    "BackendApi",
    `topicarea/${topicAreaId}`,
    expect.anything()
  );
});

test("renameTopicArea makes a PUT request to topicarea API", async () => {
  const topicAreaId = "123";
  const newName = "My New Name";
  await BackendService.renameTopicArea(topicAreaId, newName);
  expect(API.put).toHaveBeenCalledWith(
    "BackendApi",
    `topicarea/${topicAreaId}`,
    expect.objectContaining({
      body: {
        name: newName,
      },
    })
  );
});

test("updateSetting makes a PUT request to settings API", async () => {
  const settingKey = "publishingGuidance";
  const settingValue = "foo=bar";
  const now = new Date();
  await BackendService.updateSetting(settingKey, settingValue, now);
  expect(API.put).toHaveBeenCalledWith(
    "BackendApi",
    `settings`,
    expect.objectContaining({
      body: {
        updatedAt: now,
        publishingGuidance: "foo=bar",
      },
    })
  );
});

test("fetchDashboardByFriendlyURL makes a GET request to public API", async () => {
  const friendlyURL = "my-friendly-url";
  await BackendService.fetchPublicDashboardByURL(friendlyURL);
  expect(API.get).toHaveBeenCalledWith(
    "BackendApi",
    `public/dashboard/friendly-url/my-friendly-url`,
    {}
  );
});

test("fetchPublicSettings makes a GET request to public API", async () => {
  await BackendService.fetchPublicSettings();
  expect(API.get).toHaveBeenCalledWith("BackendApi", `public/settings`, {});
});

test("fetchUsers makes a GET request to users API", async () => {
  await BackendService.fetchUsers();
  expect(API.get).toHaveBeenCalledWith("BackendApi", "user", expect.anything());
});

test("addUsers makes a POST request to users API", async () => {
  await BackendService.addUsers("Admin", ["test1@test.com", "test2@test.com"]);
  expect(API.post).toHaveBeenCalledWith(
    "BackendApi",
    "user",
    expect.objectContaining({
      body: {
        role: "Admin",
        emails: "test1@test.com,test2@test.com",
      },
    })
  );
});

test("resendInvite makes a POST request to users API", async () => {
  await BackendService.resendInvite(["test1@test.com", "test2@test.com"]);
  expect(API.post).toHaveBeenCalledWith(
    "BackendApi",
    "user/invite",
    expect.objectContaining({
      body: {
        emails: "test1@test.com,test2@test.com",
      },
    })
  );
});

test("changeRole makes a POST request to users API", async () => {
  await BackendService.changeRole("Admin", ["test1", "test2"]);
  expect(API.put).toHaveBeenCalledWith(
    "BackendApi",
    "user/role",
    expect.objectContaining({
      body: {
        role: "Admin",
        usernames: ["test1", "test2"],
      },
    })
  );
});

test("fetchDashboardHistory makes a GET request to dashboard API", async () => {
  await BackendService.fetchDashboardHistory("001");
  expect(API.get).toBeCalledWith(
    "BackendApi",
    "dashboard/001/auditlogs",
    expect.anything()
  );
});

test("removeUsers makes a DELETE request to the users API", async () => {
  await BackendService.removeUsers(["Bob", "Alice"]);
  expect(API.del).toBeCalledWith(
    "BackendApi",
    "user",
    expect.objectContaining({
      body: {
        usernames: ["Bob", "Alice"],
      },
    })
  );
});

test("copyDashboard makes a COPY request to dashboard API", async () => {
  const dashboardId = "123";

  await BackendService.copyDashboard(dashboardId);
  expect(API.post).toHaveBeenCalledWith(
    "BackendApi",
    `dashboard/123/copy`,
    expect.anything()
  );
});
