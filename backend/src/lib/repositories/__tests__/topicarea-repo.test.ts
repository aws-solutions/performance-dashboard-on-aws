import { mocked } from "ts-jest/utils";
import { User } from "../../models/user-models";
import TopicAreaRepository from "../topicarea-repo";
import TopicAreaFactory from "../../models/topicarea-factory";

jest.mock("../../services/dynamodb");
import DynamoDBService from "../../services/dynamodb";

let user: User;
let tableName: string;
let repo: TopicAreaRepository;
let dynamodb = mocked(DynamoDBService.prototype);

beforeAll(() => {
  user = { userId: "johndoe" };
  tableName = "BadgerTable";
  process.env.BADGER_TABLE = tableName;

  DynamoDBService.getInstance = jest.fn().mockReturnValue(dynamodb);
  repo = TopicAreaRepository.getInstance();
});

describe("TopicAreaRepository", () => {
  it("should be a singleton", () => {
    const repo2 = TopicAreaRepository.getInstance();
    expect(repo).toBe(repo2);
  });
});

describe("TopicAreaRepository.create", () => {
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

describe("TopicAreaRepository.updateName", () => {
  it("should call updateItem with the correct key", async () => {
    await repo.updateName("123", "Banana", user);
    expect(dynamodb.update).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: tableName,
        Key: {
          pk: TopicAreaFactory.itemId("123"),
          sk: TopicAreaFactory.itemId("123"),
        },
      })
    );
  });

  it("should set name and updatedBy fields", async () => {
    await repo.updateName("123", "Banana", user);
    expect(dynamodb.update).toHaveBeenCalledWith(
      expect.objectContaining({
        UpdateExpression: "set #name = :name, #updatedBy = :userId",
        ExpressionAttributeValues: {
          ":name": "Banana",
          ":userId": user.userId,
        },
      })
    );
  });
});

describe("TopicAreaRepository.delete", () => {
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

describe("TopicAreaRepository.list", () => {
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
      Items: [{
        pk: 'TopicArea-213',
        sk: 'TopicArea-213',
        name: 'Serverless is more',
        createdBy: 'johndoe',
      }],
    });

    const list = await repo.list();
    expect(list.length).toEqual(1);
    expect(list[0]).toEqual({
      id: '213',
      name: 'Serverless is more',
      createdBy: 'johndoe',
    });
  });
});
