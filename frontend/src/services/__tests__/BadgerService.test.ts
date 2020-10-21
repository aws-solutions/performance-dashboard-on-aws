import { API, Auth } from "aws-amplify";
import BadgerService from "../BadgerService";
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

  await BadgerService.fetchDashboardById(dashboardId);
  expect(API.get).toHaveBeenCalledWith(
    "BadgerApi",
    `dashboard/${dashboardId}`,
    expect.anything()
  );
});

test("createDashboard should make a POST request with payload", async () => {
  const name = "One Pretty Dashboard";
  const description = "Alexa, how is the weather?";
  const topicAreaId = "xyz";

  await BadgerService.createDashboard(name, topicAreaId, description);

  expect(API.post).toHaveBeenCalledWith(
    "BadgerApi",
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

  await BadgerService.editDashboard(
    dashboardId,
    name,
    topicAreaId,
    description,
    updatedAt
  );

  expect(API.put).toHaveBeenCalledWith(
    "BadgerApi",
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

  await BadgerService.publishDashboard(dashboardId, updatedAt, releaseNotes);

  expect(API.put).toHaveBeenCalledWith(
    "BadgerApi",
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

  await BadgerService.deleteDashboards(dashboardIds);
  expect(API.del).toHaveBeenCalledWith(
    "BadgerApi",
    `dashboard?ids=123,456`,
    expect.anything()
  );
});

test("fetchWidgetById makes a GET request to widget API", async () => {
  const dashboardId = "123";
  const widgetId = "abc";

  await BadgerService.fetchWidgetById(dashboardId, widgetId);
  expect(API.get).toHaveBeenCalledWith(
    "BadgerApi",
    `dashboard/${dashboardId}/widget/${widgetId}`,
    expect.anything()
  );
});

test("deleteWidget makes a DELETE request to widget API", async () => {
  const dashboardId = "123";
  const widgetId = "abc";

  await BadgerService.deleteWidget(dashboardId, widgetId);
  expect(API.del).toHaveBeenCalledWith(
    "BadgerApi",
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

  await BadgerService.setWidgetOrder(dashboardId, widgets);
  expect(API.put).toHaveBeenCalledWith(
    "BadgerApi",
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
  await BadgerService.fetchHomepage();
  expect(API.get).toHaveBeenCalledWith("BadgerApi", "homepage", {});
});

test("fetchPublicDashboard makes a GET request to public API", async () => {
  await BadgerService.fetchPublicDashboard("123");
  expect(API.get).toHaveBeenCalledWith("BadgerApi", "public/dashboard/123", {});
});

test("createDraft makes a POST request to dashboard API", async () => {
  await BadgerService.createDraft("123");
  expect(API.post).toBeCalledWith(
    "BadgerApi",
    "dashboard/123",
    expect.anything()
  );
});

test("publishPending makes a PUT request to dashboard API", async () => {
  const lastUpdatedAt = new Date();
  await BadgerService.publishPending("123", lastUpdatedAt);
  expect(API.put).toBeCalledWith(
    "BadgerApi",
    "dashboard/123/publishpending",
    expect.objectContaining({
      body: {
        updatedAt: lastUpdatedAt,
      },
    })
  );
});
