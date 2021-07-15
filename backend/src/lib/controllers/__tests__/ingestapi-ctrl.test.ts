import { Request, Response } from "express";
import { mocked } from "ts-jest/utils";
import IngestApiCtrl from "../ingestapi-ctrl";
import { Dataset, SourceType } from "../../models/dataset";
import DatasetRepository from "../../repositories/dataset-repo";
import DatasetService from "../../services/dataset-service";
import DatasetFactory from "../../factories/dataset-factory";

jest.mock("../../repositories/dataset-repo");
jest.mock("../../factories/dataset-factory");

const repository = mocked(DatasetRepository.prototype);
const res = {
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as any as Response;

beforeEach(() => {
  DatasetRepository.getInstance = jest.fn().mockReturnValue(repository);
});

//Unit Test for metric api create dataset
describe("createDataset", () => {
  let req: Request;
  beforeEach(() => {
    req = {
      body: {
        metadata: {
          name: "covid-dataset.csv",
          schema: "Metrics",
        },
        data: [
          {
            title: "test1",
            value: 1,
            percentage: "",
            currency: "",
            changeOverTime: "",
            startDate: "",
            endDate: "",
          },
        ],
      },
    } as any as Request;
  });

  it("returns a 400 error when currency is not in the dropdown", async () => {
    req.body.data[0].currency = "Dollar ";
    req.body.data[0].percentage = "Currency";
    await IngestApiCtrl.createDataset(req, res);
    expect(res.send).toBeCalledWith(
      "Invalid symbol type. Choose either ``, `Dollar $`, `Euro €` or `Pound £`"
    );
  });

  it("returns a 400 error when percentage is not in the dropdown", async () => {
    req.body.data[0].currency = "";
    req.body.data[0].percentage = "PI";
    await IngestApiCtrl.createDataset(req, res);
    expect(res.send).toBeCalledWith(
      "Invalid symbol type. Choose either `Currency`, `Percentage` or ``"
    );
  });

  it("returns a 400 error when symbol is currency, but currency type is not selected", async () => {
    req.body.data[0].currency = "";
    req.body.data[0].percentage = "Currency";
    await IngestApiCtrl.createDataset(req, res);
    expect(res.send).toBeCalledWith("Missing optional field `currency`");
  });

  it("returns a 400 error when currency type is selected, but symbol type is not currency", async () => {
    req.body.data[0].currency = "Dollar $";
    req.body.data[0].percentage = "Percentage";
    await IngestApiCtrl.createDataset(req, res);
    expect(res.send).toBeCalledWith(
      "Can only input currency type along with `Currency`"
    );
  });
});

describe("createDataset", () => {
  let req: Request;
  beforeEach(() => {
    req = {
      body: {
        metadata: {
          name: "covid-dataset.csv",
          createdBy: "johndoe",
        },
        data: [{ data: "data" }],
      },
    } as any as Request;
  });

  it("returns a 400 error when schema is invalid and escapes HTML characters", async () => {
    req.body.metadata.schema = "<script>temps</script>";
    await IngestApiCtrl.createDataset(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(
      "Unknown schema provided '&lt;script&gt;temps&lt;/script&gt;'"
    );
  });

  it("returns a 400 error when metadata.name is missing", async () => {
    delete req.body.metadata.name;
    await IngestApiCtrl.createDataset(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required field `metadata.name`");
  });

  it("returns a 400 error when data is missing", async () => {
    delete req.body.data;
    await IngestApiCtrl.createDataset(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required field `data`");
  });

  it("returns a 400 error if data cannot be parsed", async () => {
    req.body.data = "This is not a valid JSON";
    jest.spyOn(DatasetService, "parse");

    await IngestApiCtrl.createDataset(req, res);

    expect(res.status).toBeCalledWith(400);
    expect(DatasetService.parse).toBeCalledWith(
      "This is not a valid JSON",
      undefined
    );
  });

  it("uploads the data content to S3", async () => {
    await IngestApiCtrl.createDataset(req, res);
    expect(repository.uploadDatasetContent).toBeCalled();
  });

  it("builds a new dataset using the proper values", async () => {
    const s3Key = "00001";
    jest.spyOn(repository, "uploadDatasetContent").mockResolvedValue(s3Key);

    await IngestApiCtrl.createDataset(req, res);
    expect(DatasetFactory.createNew).toBeCalledWith({
      fileName: "covid-dataset.csv",
      createdBy: "ingestapi",
      s3Key: {
        raw: s3Key,
        json: s3Key,
      },
      sourceType: SourceType.IngestApi,
    });
  });

  it("saves the dataset", async () => {
    const dataset = {} as Dataset;
    DatasetFactory.createNew = jest.fn().mockReturnValue(dataset);
    await IngestApiCtrl.createDataset(req, res);
    expect(repository.saveDataset).toBeCalledWith(dataset);
  });
});

describe("updateDataset", () => {
  let req: Request;
  beforeEach(() => {
    req = {
      body: {
        metadata: {
          name: "covid-dataset.csv",
        },
        data: [{ data: "data" }],
      },
      params: { id: "abc" },
    } as any as Request;
  });

  it("returns a 400 error when metadata is missing", async () => {
    delete req.body.metadata;
    await IngestApiCtrl.updateDataset(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required field `metadata`");
  });

  it("returns a 400 error when metadata.name is missing", async () => {
    delete req.body.metadata.name;
    await IngestApiCtrl.updateDataset(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required field `name`");
  });

  it("returns a 400 error when data is missing", async () => {
    delete req.body.data;
    await IngestApiCtrl.updateDataset(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required field `data`");
  });

  it("saves the dataset", async () => {
    jest.spyOn(DatasetService, "updateDataset");
    await IngestApiCtrl.updateDataset(req, res);
    expect(DatasetService.updateDataset).toBeCalled();
  });
});

describe("deleteDataset", () => {
  let req: Request;
  beforeEach(() => {
    req = {
      params: {
        id: "abc",
      },
    } as any as Request;
  });

  it("deletes the dataset", async () => {
    await IngestApiCtrl.deleteDataset(req, res);
    expect(repository.deleteDataset).toBeCalledWith("abc");
  });
});
