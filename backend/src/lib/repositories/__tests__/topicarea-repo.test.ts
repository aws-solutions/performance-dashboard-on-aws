import { mocked } from "ts-jest/utils";
import { User } from "../../models/user";
import { DashboardList } from "../../models/dashboard";
import TopicAreaRepository from "../topicarea-repo";
import DashboardRepository from "../dashboard-repo";
import TopicAreaFactory from "../../factories/topicarea-factory";
import DynamoDBService from "../../services/dynamodb";

jest.mock("../../services/dynamodb");
jest.mock("../../repositories/dashboard-repo");

let user: User;
let tableName: string;
let repo: TopicAreaRepository;
let dynamodb = mocked(DynamoDBService.prototype);
let dashboardRepo = mocked(DashboardRepository.prototype);

beforeAll(() => {
  user = { userId: "johndoe" };
  tableName = "MainTable";
  process.env.MAIN_TABLE = tableName;

  DynamoDBService.getInstance = jest.fn().mockReturnValue(dynamodb);
  DashboardRepository.getInstance = jest.fn().mockReturnValue(dashboardRepo);
  repo = TopicAreaRepository.getInstance();
});

describe("TopicAreaRepository", () => {
  it("should be a singleton", () => {
    const repo2 = TopicAreaRepository.getInstance();
    expect(repo).toBe(repo2);
  });
});

describe("create", () => {
  it("should call putItem on dynamodb", async () => {
    const topicarea = TopicAreaFactory.createNew("Banana", user);
    const item = TopicAreaFactory.toItem(topicarea);

    await repo.create(topicarea);

    expect(dynamodb.put).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: tableName,
        Item: item,
      })
    );
  });
});

describe("createNew", () => {
  it("should call putItem on dynamodb", async () => {
    const topicarea = TopicAreaFactory.createNew("Banana", user);
    const item = TopicAreaFactory.toItem(topicarea);

    await repo.create(topicarea);

    expect(dynamodb.put).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: tableName,
        Item: item,
      })
    );
  });
});

describe("delete", () => {
  it("should call delete with the correct key", async () => {
    await repo.delete("123456");
    expect(dynamodb.delete).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: tableName,
        Key: {
          pk: TopicAreaFactory.itemId("123456"),
          sk: TopicAreaFactory.itemId("123456"),
        },
      })
    );
  });
});

describe("list", () => {
  it("should query using the correct GSI", async () => {
    // Mock query response
    dynamodb.query = jest.fn().mockReturnValue({});

    await repo.list();

    expect(dynamodb.query).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: tableName,
        IndexName: "byType",
      })
    );
  });

  it("returns a list of topic areas", async () => {
    // Mock query response
    dynamodb.query = jest.fn().mockReturnValue({
      Items: [
        {
          pk: "TopicArea#213",
          sk: "TopicArea#213",
          name: "Serverless is more",
          createdBy: "johndoe",
        },
      ],
    });

    // Simulate 5 dashboards associated to this topic area
    jest.spyOn(repo, "getDashboardCount").mockReturnValue(Promise.resolve(5));

    const list = await repo.list();
    expect(list.length).toEqual(1);

    const topicarea = list[0];
    expect(topicarea).toEqual({
      id: "213",
      name: "Serverless is more",
      createdBy: "johndoe",
      dashboardCount: 5,
    });

    jest.restoreAllMocks();
  });
});

describe("getTopicAreaById", () => {
  it("returns topic area by id", async () => {
    // Mock query response
    dynamodb.get = jest.fn().mockReturnValue({
      Item: {
        pk: "TopicArea#213",
        sk: "TopicArea#213",
        name: "Serverless is more",
        createdBy: "johndoe",
      },
    });

    const item = await repo.getTopicAreaById("213");
    expect(item).toEqual({
      id: "213",
      name: "Serverless is more",
      createdBy: "johndoe",
    });
  });
});

describe("getDashboardCount", () => {
  it("returns the number of dashboards for a given topic area", async () => {
    // Mock query response to simulate 2 dashboard versions in this topic area.
    dynamodb.query = jest.fn().mockReturnValue({
      Items: [
        {
          pk: "Dashboard#002",
          sk: "Dashboard#002",
          name: "My AWS Dashboard",
          type: "Dashboard",
          version: 2,
          parentDashboardId: "001", // Both dashboards belong to parent 001
          topicAreaId: "TopicArea#123",
        },
        {
          pk: "Dashboard#001",
          sk: "Dashboard#001",
          name: "My AWS Dashboard",
          type: "Dashboard",
          version: 1,
          parentDashboardId: "001", // Both dashboards belong to parent 001
          topicAreaId: "TopicArea#123",
        },
      ],
    });

    const count = await repo.getDashboardCount("123");
    expect(count).toEqual(1);
  });
});

describe("renameTopicArea", () => {
  it("updates topic area name", async () => {
    await repo.renameTopicArea("123", "New name", user);
    expect(dynamodb.update).toBeCalledWith(
      expect.objectContaining({
        TableName: tableName,
        Key: {
          pk: "TopicArea#123",
          sk: "TopicArea#123",
        },
        UpdateExpression: "set #name = :name",
        ExpressionAttributeNames: {
          "#name": "name",
        },
        ExpressionAttributeValues: {
          ":name": "New name",
        },
      })
    );
  });

  it("updates all related dashboards", async () => {
    const relatedDashboards: DashboardList = [];
    dashboardRepo.listDashboardsInTopicArea = jest
      .fn()
      .mockReturnValue(relatedDashboards);

    await repo.renameTopicArea("123", "New name", user);

    expect(dashboardRepo.updateTopicAreaName).toBeCalledWith(
      relatedDashboards,
      "New name",
      user
    );
  });
});
