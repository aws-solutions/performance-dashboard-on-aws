import { mocked } from "ts-jest/utils";
import { Dataset, DatasetItem } from "../../models/dataset";
import DatasetFactory from "../../factories/dataset-factory";
import DatasetRepository from "../dataset-repo";
import DynamoDBService from "../../services/dynamodb";
import S3Service from "../../services/s3";

jest.mock("../../services/dynamodb");
jest.mock("../../services/s3");
jest.mock("../../factories/dataset-factory");

let tableName: string;
let datasetsBucket: string;
let repo: DatasetRepository;
let dynamodb = mocked(DynamoDBService.prototype);
let s3Service = mocked(S3Service.prototype);

beforeAll(() => {
  tableName = "BadgerTable";
  datasetsBucket = "badger-datasets-bucket";
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
