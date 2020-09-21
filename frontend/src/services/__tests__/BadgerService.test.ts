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

test("editDashboard should make a POST request with payload", async () => {
  const dashboardId = "123";
  const name = "One Pretty Dashboard";
  const description = "Alexa, how is the weather?";
  const topicAreaId = "xyz";

  await BadgerService.editDashboard(
    dashboardId,
    name,
    topicAreaId,
    description
  );

  expect(API.put).toHaveBeenCalledWith(
    "BadgerApi",
    `dashboard/${dashboardId}`,
    expect.objectContaining({
      body: {
        name,
        topicAreaId,
        description,
      },
    })
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
  const widgets: Array<Widget> = [
    {
      id: "abc",
      name: "Apple",
      order: 1,
      widgetType: "Table",
      updatedAt: "2020-09-17T21:01:00.780Z",
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
            id: "abc",
            updatedAt: "2020-09-17T21:01:00.780Z",
            order: 1,
          },
        ],
      },
    })
  );
});
