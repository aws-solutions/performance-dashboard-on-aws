import { DatasetItem, SourceType, DatasetSchema } from "../../models/dataset";
import * as uuid from "uuid";
import DatasetFactory from "../dataset-factory";

jest.mock("uuid");
jest.spyOn(uuid, "v4").mockReturnValue("123");

let now: Date;
beforeEach(() => {
  now = new Date();
  jest.useFakeTimers("modern");
  jest.setSystemTime(now);
});

describe("createNew", () => {
  it("creates a new dataset object", () => {
    const dataset = DatasetFactory.createNew({
      fileName: "covid.csv",
      createdBy: "johndoe",
      s3Key: {
        raw: "abc.csv",
        json: "abc.json",
      },
      sourceType: SourceType.FileUpload,
      schema: "Metrics",
    });

    expect(dataset).toEqual({
      id: "123",
      fileName: "covid.csv",
      createdBy: "johndoe",
      s3Key: {
        raw: "abc.csv",
        json: "abc.json",
      },
      updatedAt: now,
      sourceType: SourceType.FileUpload,
      schema: DatasetSchema.Metrics,
    });
  });

  it("defaults to none if no schema is provided", () => {
    const dataset = DatasetFactory.createNew({
      fileName: "covid.csv",
      createdBy: "johndoe",
      s3Key: {
        raw: "abc.csv",
        json: "abc.json",
      },
      sourceType: SourceType.FileUpload,
    });

    expect(dataset.schema).toEqual(DatasetSchema.None);
  });
});

it("converts a dataset into a dynamodb item", () => {
  const dataset = DatasetFactory.createNew({
    fileName: "covid.csv",
    createdBy: "johndoe",
    s3Key: {
      raw: "abc.csv",
      json: "abc.json",
    },
    sourceType: SourceType.FileUpload,
    schema: DatasetSchema.None,
  });

  const item = DatasetFactory.toItem(dataset);
  expect(item).toEqual({
    pk: "Dataset#123",
    sk: "Dataset#123",
    type: "Dataset",
    fileName: "covid.csv",
    createdBy: "johndoe",
    s3Key: {
      raw: "abc.csv",
      json: "abc.json",
    },
    updatedAt: now.toISOString(),
    sourceType: SourceType.FileUpload,
    schema: "None",
  });
});

describe("fromItem", () => {
  it("converts a dynamo item into a dataset", () => {
    const item: DatasetItem = {
      pk: "Dataset#123",
      sk: "Dataset#123",
      type: "Dataset",
      fileName: "covid.csv",
      createdBy: "johndoe",
      s3Key: {
        raw: "abc.csv",
        json: "abc.json",
      },
      updatedAt: now.toISOString(),
      sourceType: SourceType.IngestApi,
      schema: "Metrics",
    };

    const dataset = DatasetFactory.fromItem(item);
    expect(dataset).toEqual({
      id: "123",
      fileName: "covid.csv",
      createdBy: "johndoe",
      s3Key: {
        raw: "abc.csv",
        json: "abc.json",
      },
      updatedAt: now,
      sourceType: SourceType.IngestApi,
      schema: DatasetSchema.Metrics,
    });
  });

  it("defaults schema to None if undefined", () => {
    const item: DatasetItem = {
      pk: "Dataset#123",
      sk: "Dataset#123",
      type: "Dataset",
      fileName: "covid.csv",
      createdBy: "johndoe",
      s3Key: {
        raw: "abc.csv",
        json: "abc.json",
      },
      updatedAt: now.toISOString(),
      sourceType: SourceType.IngestApi,
    };

    const dataset = DatasetFactory.fromItem(item);
    expect(dataset.schema).toEqual(DatasetSchema.None);
  });
});
