import { mocked } from "ts-jest/utils";
import { Dataset, DatasetItem, SourceType } from "../../models/dataset";
import DatasetFactory from "../../factories/dataset-factory";
import DatasetRepository from "../dataset-repo";
import DynamoDBService from "../../services/dynamodb";
import S3Service from "../../services/s3";
import * as uuid from "uuid";
import { WidgetType } from "../../models/widget";

jest.mock("../../services/dynamodb");
jest.mock("../../services/s3");
jest.mock("../../factories/dataset-factory");
jest.mock("uuid");
jest.spyOn(uuid, "v4").mockReturnValue("123");

let tableName: string;
let datasetsBucket: string;
let repo: DatasetRepository;
let dynamodb = mocked(DynamoDBService.prototype);
let s3Service = mocked(S3Service.prototype);

beforeAll(() => {
  tableName = "MainTable";
  datasetsBucket = "performancedash-datasets-bucket";
  process.env.MAIN_TABLE = tableName;
  process.env.DATASETS_BUCKET = datasetsBucket;

  DynamoDBService.getInstance = jest.fn().mockReturnValue(dynamodb);
  S3Service.getInstance = jest.fn().mockReturnValue(s3Service);
  repo = DatasetRepository.getInstance();
});

describe("DatasetRepository", () => {
  it("should be a singleton", () => {
    const repo2 = DatasetRepository.getInstance();
    expect(repo).toBe(repo2);
  });
});

describe("saveDataset", () => {
  it("throws an error if raw file does not exist on S3", async () => {
    s3Service.objectExists = jest.fn().mockReturnValue(false);
    const dataset = { s3Key: { raw: "abc.csv" } } as Dataset;
    console.error = jest.fn();

    try {
      await repo.saveDataset(dataset);
      expect.hasAssertions();
    } catch (err) {
      expect(s3Service.objectExists).toBeCalledWith(
        datasetsBucket,
        "public/abc.csv"
      );
    }
  });

  it("throws an error if JSON file does not exist on S3", async () => {
    s3Service.objectExists = jest.fn().mockReturnValueOnce(true);
    const dataset = { s3Key: { json: "abc.json" } } as Dataset;
    console.error = jest.fn();

    try {
      await repo.saveDataset(dataset);
      expect.hasAssertions();
    } catch (err) {
      expect(s3Service.objectExists.mock.calls[1][0]).toEqual(datasetsBucket);
      expect(s3Service.objectExists.mock.calls[1][1]).toEqual(
        "public/abc.json"
      );
    }
  });

  it("saves the item in dynamodb", async () => {
    const dataset = { s3Key: { json: "abc.json", raw: "abc.csv" } } as Dataset;
    const item = {} as DatasetItem;

    s3Service.objectExists = jest.fn().mockReturnValue(true);
    DatasetFactory.toItem = jest.fn().mockReturnValue(item);

    await repo.saveDataset(dataset);
    expect(dynamodb.put).toBeCalledWith({
      TableName: tableName,
      Item: item,
    });
  });
});

describe("createDataset", () => {
  it("create the item in dynamodb", async () => {
    const metadata = { name: "abc", createdBy: "johndoe" };
    const data = [{ data: "data" }];
    const item = {} as DatasetItem;

    s3Service.putObject = jest.fn().mockReturnValue(true);
    s3Service.objectExists = jest.fn().mockReturnValue(true);
    DatasetFactory.toItem = jest.fn().mockReturnValue(item);

    await repo.createDataset(metadata, data);
    expect(dynamodb.put).toBeCalledWith({
      TableName: tableName,
      Item: item,
    });
  });
});

describe("updateDataset", () => {
  it("update the item in dynamodb", async () => {
    const id = "123";
    const metadata = { name: "abc" };
    const data = [{ data: "data" }];

    const dataset: Dataset = {
      id: "123",
      createdBy: "johndoe",
      fileName: "abc",
      s3Key: {
        json: "def.json",
        raw: "",
      },
      updatedAt: new Date(),
      sourceType: SourceType.IngestApi,
    };
    repo.getDatasetById = jest.fn().mockReturnValue(dataset);
    s3Service.putObject = jest.fn().mockReturnValue(true);
    s3Service.objectExists = jest.fn().mockReturnValue(true);

    await repo.updateDataset(id, metadata, data);
    expect(dynamodb.update).toBeCalledWith(
      expect.objectContaining({
        TableName: tableName,
        Key: {
          pk: DatasetFactory.itemId("123"),
          sk: DatasetFactory.itemId("123"),
        },
      })
    );
  });
});

describe("getWidgetCount", () => {
  it("returns the number of widgets for a given dataset id", async () => {
    // Mock query response to simulate 2 widgets.
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
        {
          pk: "Dashboard#abc",
          sk: "Widget#123",
          widgetType: WidgetType.Chart,
          order: 1,
          updatedAt: now.toISOString(),
          name: "AWS",
          content: { datasetId: "abc" },
        },
      ],
    });

    const count = await repo.getWidgetCount("abc");
    expect(count).toEqual(1);
  });
});
