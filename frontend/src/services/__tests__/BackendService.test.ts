import { API, Auth } from "aws-amplify";
import BackendService from "../BackendService";
import { Widget } from "../../models";

jest.mock("aws-amplify");

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

  const updatedAt = new Date("2020-09-17T21:01:00.780Z");

  await BackendService.editDashboard(
    dashboardId,
    name,
    topicAreaId,
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

  await BackendService.publishDashboard(dashboardId, updatedAt, releaseNotes);

  expect(API.put).toHaveBeenCalledWith(
    "BackendApi",
    `dashboard/${dashboardId}/publish`,
    expect.objectContaining({
      body: {
        updatedAt,
        releaseNotes,
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
          },
        ],
      },
    })
  );
});

test("fetchHomepage makes a GET request to widget API", async () => {
  await BackendService.fetchHomepage();
  expect(API.get).toHaveBeenCalledWith("BackendApi", "public/homepage", {});
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
  await BackendService.publishPending("123", lastUpdatedAt);
  expect(API.put).toBeCalledWith(
    "BackendApi",
    "dashboard/123/publishpending",
    expect.objectContaining({
      body: {
        updatedAt: lastUpdatedAt,
      },
    })
  );
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
