import { mocked } from "ts-jest/utils";
import { User } from "../../models/user";
import DashboardRepository from "../dashboard-repo";
import DashboardFactory from "../../factories/dashboard-factory";
import TopicAreaFactory from "../../factories/topicarea-factory";

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
    const dashboard = DashboardFactory.create(
      "123",
      "Dashboard1",
      "456",
      "Topic1",
      "Description Test",
      user
    );
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

describe("DashboardRepository.createNew", () => {
  it("should call putItem on dynamodb", async () => {
    const dashboard = DashboardFactory.createNew(
      "Dashboard1",
      "456",
      "Topic1",
      "Description Test",
      user
    );
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

describe("DashboardRepository.updateDashboard", () => {
  it("should call updateItem with the correct keys", async () => {
    const dashboard = DashboardFactory.create(
      "123",
      "Dashboard1",
      "456",
      "Topic1",
      "Description Test",
      user
    );
    await repo.updateDashboard(dashboard, user);
    expect(dynamodb.update).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: tableName,
        Key: {
          pk: DashboardFactory.itemId("123"),
          sk: DashboardFactory.itemId("123"),
        },
      })
    );
  });

  it("should call update with all the fields", async () => {
    const dashboard = DashboardFactory.create(
      "123",
      "Dashboard1",
      "456",
      "Topic1",
      "Description Test",
      user
    );
    await repo.updateDashboard(dashboard, user);
    expect(dynamodb.update).toHaveBeenCalledWith(
      expect.objectContaining({
        UpdateExpression:
          "set #dashboardName = :dashboardName, #topicAreaId = :topicAreaId, #topicAreaName = :topicAreaName, #description = :description, #updatedBy = :userId",
        ExpressionAttributeValues: {
          ":dashboardName": dashboard.name,
          ":topicAreaId": TopicAreaFactory.itemId(dashboard.topicAreaId),
          ":topicAreaName": dashboard.topicAreaName,
          ":description": dashboard.description,
          ":userId": user.userId,
        },
      })
    );
  });
});

describe("DashboardRepository.delete", () => {
  it("should call delete with the correct key", async () => {
    await repo.delete("123");
    expect(dynamodb.delete).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: tableName,
        Key: {
          pk: DashboardFactory.itemId("123"),
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
      Items: [
        {
          pk: "Dashboard#123",
          sk: "Dashboard#123",
          topicAreaId: "TopicArea#456",
          topicAreaName: "Topic 1",
          dashboardName: "Test name",
          description: "description test",
          createdBy: "test",
        },
      ],
    });

    const list = await repo.listDashboards();
    expect(list.length).toEqual(1);
    expect(list[0]).toEqual({
      id: "123",
      name: "Test name",
      topicAreaId: "456",
      topicAreaName: "Topic 1",
      description: "description test",
      createdBy: "test",
    });
  });

  it("returns a dashboard by id", async () => {
    // Mock query response
    dynamodb.get = jest.fn().mockReturnValue({
      Item: {
        pk: "Dashboard#123",
        sk: "Dashboard#123",
        topicAreaId: "TopicArea#456",
        topicAreaName: "Topic 1",
        dashboardName: "Test name",
        description: "description test",
        createdBy: "test",
      },
    });

    const item = await repo.getDashboardById("123");
    expect(item).toEqual({
      id: "123",
      name: "Test name",
      topicAreaId: "456",
      topicAreaName: "Topic 1",
      description: "description test",
      createdBy: "test",
    });
  });

  it("returns a list of dashboards within a topic area", async () => {
    // Mock query response
    dynamodb.query = jest.fn().mockReturnValue({});

    const topicAreaId = "456";

    await repo.listDashboardsWithinTopicArea(topicAreaId);

    expect(dynamodb.query).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: tableName,
        KeyConditionExpression: "#topicAreaId = :topicAreaId",
        ExpressionAttributeValues: {
          ":topicAreaId": TopicAreaFactory.itemId(topicAreaId),
        },
      })
    );

    // Mock query response
    dynamodb.query = jest.fn().mockReturnValue({
      Items: [
        {
          pk: "Dashboard#123",
          sk: "Dashboard#123",
          topicAreaId: `TopicArea#${topicAreaId}`,
          topicAreaName: "Topic 1",
          dashboardName: "Test name",
          description: "description test",
          createdBy: "test",
        },
      ],
    });

    const list = await repo.listDashboardsWithinTopicArea(topicAreaId);
    expect(list.length).toEqual(1);
    expect(list[0]).toEqual({
      id: "123",
      name: "Test name",
      topicAreaId: topicAreaId,
      topicAreaName: "Topic 1",
      description: "description test",
      createdBy: "test",
    });
  });
});

describe("DashboardRepository.getDashboardWithWidgets", () => {
  it("throws an error when dashboardId is not found", () => {
    dynamodb.query = jest.fn().mockReturnValue({ Items: [] });
    return expect(repo.getDashboardWithWidgets("123")).rejects.toThrowError();
  });

  it("returns a dashboard with no widgets", async () => {
    dynamodb.query = jest.fn().mockReturnValue({
      Items: [
        {
          pk: "Dashboard#123",
          sk: "Dashboard#123",
          name: "AWS Dashboard",
          type: "Dashboard",
          topicAreaId: "TopicArea#cb9ad",
        },
      ],
    });

    const dashboard = await repo.getDashboardWithWidgets("123");
    expect(dashboard.id).toEqual("123");
    expect(dashboard.widgets).toHaveLength(0);
  });

  it("returns a dashboard with widgets", async () => {
    dynamodb.query = jest.fn().mockReturnValue({
      Items: [
        {
          pk: "Dashboard#123",
          sk: "Dashboard#123",
          name: "AWS Dashboard",
          type: "Dashboard",
          topicAreaId: "TopicArea#cb9ad",
        },
        {
          pk: "Dashboard#123",
          sk: "Widget#abc",
          type: "Widget",
          name: "Some name",
          widgetType: "Text",
          content: {},
        },
      ],
    });

    const dashboard = await repo.getDashboardWithWidgets("123");
    expect(dashboard.widgets).toHaveLength(1);
  });
});
