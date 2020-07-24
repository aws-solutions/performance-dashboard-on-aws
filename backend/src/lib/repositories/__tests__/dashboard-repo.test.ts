import { mocked } from "ts-jest/utils";
import { User } from "../../models/user-models";
import DashboardRepository from "../dashboard-repo";
import DashboardFactory from "../../models/dashboard-factory";
import TopicAreaFactory from "../../models/topicarea-factory";

jest.mock("../../services/dynamodb");
import DynamoDBService from "../../services/dynamodb";

let user: User;
let tableName: string;
let repo: DashboardRepository;
let dynamodb = mocked(DynamoDBService.prototype);

beforeAll(() => {
  user = { userId: "test" };
  tableName = "BadgerTable";
  process.env.BADGER_TABLE = tableName;

  DynamoDBService.getInstance = jest.fn().mockReturnValue(dynamodb);
  repo = DashboardRepository.getInstance();
});

describe("DashboardRepository", () => {
  it("should be a singleton", () => {
    const repo2 = DashboardRepository.getInstance();
    expect(repo).toBe(repo2);
  });
});

describe("DashboardRepository.create", () => {
  it("should call putItem on dynamodb", async () => {
    const dashboard = DashboardFactory.createNew('Dashboard1', '123', 'Topic1', 'descrption test', user);
    const item = DashboardFactory.toItem(dashboard);

    await repo.putDashboard(dashboard);

    expect(dynamodb.put).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: tableName,
        Item: item,
      })
    );
  });
});

describe("DashboardRepository.delete", () => {
  it("should call delete with the correct key", async () => {
    await repo.delete("123", "456");
    expect(dynamodb.delete).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: tableName,
        Key: {
          pk: TopicAreaFactory.itemId("456"),
          sk: DashboardFactory.itemId("123"),
        },
      })
    );
  });
});

describe("DashboardRepository.listDashboards", () => {
  it("should query using the correct GSI", async () => {
    // Mock query response
    dynamodb.query = jest.fn().mockReturnValue({});

    await repo.listDashboards();

    expect(dynamodb.query).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: tableName,
        IndexName: "byType",
      })
    );
  });

  it("returns a list of dashboards", async () => {
    // Mock query response
    dynamodb.query = jest.fn().mockReturnValue({
      Items: [{
        pk: 'TopicArea-456',
        sk: 'Dashboard-123',
        topicAreaName: 'Topic 1',
        dashboardName: 'Test name',
        description: 'description test',
        createdBy: 'test',
      }],
    });

    const list = await repo.listDashboards();
    expect(list.length).toEqual(1);
    expect(list[0]).toEqual({
      id: '123',
      name: 'Test name',
      topicAreaId: '456',
      topicAreaName: 'Topic 1',
      description: 'description test',
      createdBy: 'test',
    });
  });

  it("returns a dashboard by id", async () => {
    // Mock query response
    dynamodb.get = jest.fn().mockReturnValue({
      Item: {
        pk: 'TopicArea-456',
        sk: 'Dashboard-123',
        topicAreaName: 'Topic 1',
        dashboardName: 'Test name',
        description: 'description test',
        createdBy: 'test',
      },
    });

    const item = await repo.getDashboardById('123', '456');
    expect(item).toEqual({
      id: '123',
      name: 'Test name',
      topicAreaId: '456',
      topicAreaName: 'Topic 1',
      description: 'description test',
      createdBy: 'test',
    });
  });
});
