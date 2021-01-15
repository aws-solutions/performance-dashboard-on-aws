import { Request, Response } from "express";
import { mocked } from "ts-jest/utils";
import IngestApiCtrl from "../ingestapi-ctrl";
import DatasetRepository from "../../repositories/dataset-repo";
import DatasetService from "../../services/dataset-service";

jest.mock("../../repositories/dataset-repo");

const repository = mocked(DatasetRepository.prototype);
const res = ({
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as any) as Response;

beforeEach(() => {
  DatasetRepository.getInstance = jest.fn().mockReturnValue(repository);
});

describe("createDataset", () => {
  let req: Request;
  beforeEach(() => {
    req = ({
      body: {
        metadata: {
          name: "covid-dataset.csv",
          createdBy: "johndoe",
        },
        data: [{ data: "data" }],
      },
    } as any) as Request;
  });

  it("returns a 400 error when metadata is missing", async () => {
    delete req.body.metadata;
    await IngestApiCtrl.createDataset(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required field `metadata`");
  });

  it("returns a 400 error when metadata.name is missing", async () => {
    delete req.body.metadata.name;
    await IngestApiCtrl.createDataset(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required field `name`");
  });

  it("returns a 400 error when data is missing", async () => {
    delete req.body.data;
    await IngestApiCtrl.createDataset(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required field `data`");
  });

  it("saves the dataset", async () => {
    await IngestApiCtrl.createDataset(req, res);
    expect(repository.createDataset).toBeCalledWith(
      expect.objectContaining({
        createdBy: "ingestapi",
      }),
      [{ data: "data" }]
    );
  });
});

describe("updateDataset", () => {
  let req: Request;
  beforeEach(() => {
    req = ({
      body: {
        metadata: {
          name: "covid-dataset.csv",
        },
        data: [{ data: "data" }],
      },
      params: { id: "abc" },
    } as any) as Request;
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
    req = ({
      params: {
        id: "abc",
      },
    } as any) as Request;
  });

  it("deletes the dataset", async () => {
    await IngestApiCtrl.deleteDataset(req, res);
    expect(repository.deleteDataset).toBeCalledWith("abc");
  });
});
