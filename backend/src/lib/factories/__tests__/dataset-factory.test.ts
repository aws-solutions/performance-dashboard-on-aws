import * as uuid from "uuid";
import DatasetFactory from "../dataset-factory";

jest.mock("uuid");
jest.spyOn(uuid, "v4").mockReturnValue("123");

it("creates a new dataset object", () => {
  const dataset = DatasetFactory.createNew({
    fileName: "covid.csv",
    createdBy: "johndoe",
    s3Key: {
      raw: "abc.csv",
      json: "abc.json",
    },
  });

  expect(dataset).toEqual({
    id: "123",
    fileName: "covid.csv",
    createdBy: "johndoe",
    s3Key: {
      raw: "abc.csv",
      json: "abc.json",
    },
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
  });
});
