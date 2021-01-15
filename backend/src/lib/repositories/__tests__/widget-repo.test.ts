import { mocked } from "ts-jest/utils";
import DynamoDBService from "../../services/dynamodb";
import WidgetRepository from "../widget-repo";
import { WidgetType, Widget } from "../../models/widget";
import WidgetFactory from "../../factories/widget-factory";

jest.mock("../../services/dynamodb");

let tableName: string;
let repo: WidgetRepository;
let dynamodb = mocked(DynamoDBService.prototype);

beforeAll(() => {
  tableName = "MainTable";
  process.env.MAIN_TABLE = tableName;

  dynamodb = mocked(DynamoDBService.prototype);
  DynamoDBService.getInstance = jest.fn().mockReturnValue(dynamodb);
  repo = WidgetRepository.getInstance();
});

describe("Widget Repository", () => {
  it("returns a widget by id", async () => {
    // Mock query response
    const now = new Date();
    dynamodb.get = jest.fn().mockReturnValue({
      Item: {
        pk: "Dashboard#abc",
        sk: "Widget#123",
        widgetType: WidgetType.Text,
        order: 1,
        updatedAt: now.toISOString(),
        name: "AWS",
        content: { text: "test" },
      },
    });

    const item = await repo.getWidgetById("abc", "123");
    expect(item).toEqual({
      id: "123",
      dashboardId: "abc",
      widgetType: WidgetType.Text,
      order: 1,
      updatedAt: now,
      name: "AWS",
      showTitle: true,
      content: { text: "test" },
    });
  });

  it("saves a new widget", async () => {
    const widget: Widget = {
      id: "123",
      dashboardId: "abc",
      widgetType: WidgetType.Text,
      order: 1,
      updatedAt: new Date(),
      name: "AWS",
      content: {},
    };

    const item = {};
    WidgetFactory.toItem = jest.fn().mockReturnValue(item);

    const getWidgets = jest.spyOn(repo, "getWidgets");
    getWidgets.mockResolvedValue([]);

    await repo.saveWidget(widget);
    expect(dynamodb.put).toBeCalledWith({
      TableName: tableName,
      Item: item,
    });
  });

  it("update a widget", async () => {
    const name = "AWS";
    const content = {};
    const now = new Date();
    jest.useFakeTimers("modern");
    jest.setSystemTime(now);

    await repo.updateWidget({
      dashboardId: "abc",
      widgetId: "123",
      name,
      content,
      lastUpdatedAt: now,
      showTitle: true,
    });

    expect(dynamodb.update).toHaveBeenCalledWith(
      expect.objectContaining({
        UpdateExpression:
          "set #name = :name, #content = :content, " +
          "#updatedAt = :updatedAt, #showTitle = :showTitle",
        ExpressionAttributeValues: {
          ":name": name,
          ":content": content,
          ":lastUpdatedAt": now.toISOString(),
          ":updatedAt": now.toISOString(),
          ":showTitle": true,
        },
      })
    );
  });

  it("deletes a widget", async () => {
    WidgetFactory.itemPk = jest.fn().mockReturnValue("Dashboard#123");
    WidgetFactory.itemSk = jest.fn().mockReturnValue("Widget#abc");

    await repo.deleteWidget("123", "abc");
    expect(dynamodb.delete).toHaveBeenCalledWith({
      TableName: tableName,
      Key: {
        pk: "Dashboard#123",
        sk: "Widget#abc",
      },
    });
  });

  it("saves a new widget with the proper `order`", async () => {
    const widget: Widget = {
      id: "123",
      dashboardId: "abc",
      widgetType: WidgetType.Text,
      order: 0,
      updatedAt: new Date(),
      name: "AWS",
      content: {},
    };

    // Scenario: Other widget is already created with `order=0`
    const getWidgets = jest.spyOn(repo, "getWidgets");
    getWidgets.mockResolvedValue([
      {
        id: "xyz",
        dashboardId: "123",
        name: "Existing widget",
        widgetType: WidgetType.Text,
        order: 0,
        updatedAt: new Date(),
        content: {},
      },
    ]);

    await repo.saveWidget(widget);
    expect(WidgetFactory.toItem).toBeCalledWith(
      expect.objectContaining({
        order: 1, // should be in position 1
      })
    );

    getWidgets.mockRestore();
  });

  it("sets widget order as transactions", async () => {
    WidgetFactory.itemPk = jest.fn().mockReturnValue("Dashboard#123");
    WidgetFactory.itemSk = jest.fn().mockReturnValue("Widget#abc");

    const widgets = [
      {
        id: "abc",
        order: 10,
        updatedAt: "2020-09-10T19:27:48",
      },
    ];

    const now = new Date();
    jest.useFakeTimers("modern");
    jest.setSystemTime(now);

    await repo.setWidgetOrder("123", widgets);
    expect(dynamodb.transactWrite).toBeCalledWith({
      TransactItems: expect.arrayContaining([
        {
          Update: {
            TableName: tableName,
            Key: {
              pk: WidgetFactory.itemPk("Dashboard#123"),
              sk: WidgetFactory.itemSk("Widget#abc"),
            },
            UpdateExpression: "set #order = :order, #updatedAt = :now",
            ConditionExpression: "#updatedAt <= :lastUpdated",
            ExpressionAttributeNames: {
              "#order": "order",
              "#updatedAt": "updatedAt",
            },
            ExpressionAttributeValues: {
              ":order": 10,
              ":now": now.toISOString(),
              ":lastUpdated": "2020-09-10T19:27:48",
            },
          },
        },
      ]),
    });
  });

  it("retrieves a list of widgets for a given dashboardId", async () => {
    WidgetFactory.itemPk = jest.fn().mockReturnValue("Dashboard#123");
    dynamodb.query = jest.fn().mockReturnValue({ Items: [] });

    await repo.getWidgets("123");
    expect(dynamodb.query).toBeCalledWith({
      TableName: tableName,
      KeyConditionExpression: "pk = :dashboardId and begins_with(sk, :sortKey)",
      ExpressionAttributeValues: {
        ":dashboardId": WidgetFactory.itemPk("123"),
        ":sortKey": "Widget#",
      },
    });
  });

  describe("getAssociatedWidgets", () => {
    it("returns widgets associated with a given dataset ID", async () => {
      const now = new Date();
      dynamodb.query = jest.fn().mockReturnValue({
        Items: [
          {
            pk: "Dashboard#abc",
            sk: "Widget#123",
            widgetType: WidgetType.Text,
            order: 1,
            updatedAt: now.toISOString(),
            name: "AWS",
            content: { text: "test" },
          },
        ],
      });

      const widgets = await repo.getAssociatedWidgets("abc");
      expect(widgets[0]).toEqual(
        expect.objectContaining({
          id: "123",
        })
      );
    });
  });
});
