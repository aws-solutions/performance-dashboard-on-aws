import { mocked } from "ts-jest/utils";
import DynamoDBService from "../../services/dynamodb";
import WidgetRepository from "../widget-repo";
import { WidgetType, Widget } from "../../models/widget";
import WidgetFactory from "../../factories/widget-factory";

jest.mock("../../services/dynamodb");
jest.mock("../../factories/widget-factory");

let tableName: string;
let repo: WidgetRepository;
let dynamodb = mocked(DynamoDBService.prototype);

beforeAll(() => {
  tableName = "BadgerTable";
  process.env.BADGER_TABLE = tableName;

  DynamoDBService.getInstance = jest.fn().mockReturnValue(dynamodb);
  repo = WidgetRepository.getInstance();
});

it("saves a new widget", async () => {
  const widget: Widget = {
    id: "123",
    dashboardId: "abc",
    widgetType: WidgetType.Text,
    name: "AWS",
    content: {},
  };

  const item = {};
  WidgetFactory.toItem = jest.fn().mockReturnValue(item);

  await repo.saveWidget(widget);
  expect(dynamodb.put).toBeCalledWith({
    TableName: tableName,
    Item: item,
  });
});

it("deletes a widget", async () => {
  WidgetFactory.itemPk = jest.fn().mockReturnValue("Dashboard#123");
  WidgetFactory.itemSk = jest.fn().mockReturnValue("Widget#abc");

  await repo.deleteWidget("123", "abc");
  expect(dynamodb.delete).toBeCalledWith({
    TableName: tableName,
    Key: {
      pk: "Dashboard#123",
      sk: "Widget#abc",
    },
  });
});
