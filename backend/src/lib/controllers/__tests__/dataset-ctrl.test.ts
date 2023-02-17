/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from "express";
import { mocked } from "ts-jest/utils";
import { User } from "../../models/user";
import DatasetCtrl from "../dataset-ctrl";
import DatasetRepository from "../../repositories/dataset-repo";
import DatasetFactory from "../../factories/dataset-factory";
import { ItemNotFound } from "../../errors";

jest.mock("../../repositories/dataset-repo");

const user: User = { userId: "johndoe" };
const repository = mocked(DatasetRepository.prototype);
let res: Response;

beforeEach(() => {
    DatasetRepository.getInstance = jest.fn().mockReturnValue(repository);
    res = {
        send: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    } as any as Response;
});

describe("listDatasets", () => {
    let req: Request;
    const now = new Date();
    jest.useFakeTimers("modern");
    jest.setSystemTime(now);
    beforeEach(() => {
        req = {
            user,
            params: {
                id: "123",
            },
        } as any as Request;
    });

    it("returns the datasets", async () => {
        await DatasetCtrl.listDatasets(req, res);
        expect(repository.listDatasets).toHaveBeenCalled();
    });
});

describe("getDatasetById", () => {
    let req: Request;
    const now = new Date();
    jest.useFakeTimers("modern");
    jest.setSystemTime(now);
    beforeEach(() => {
        req = {
            user,
            params: {
                id: "123",
            },
        } as any as Request;
    });

    it("returns the dataset", async () => {
        await DatasetCtrl.getDatasetById(req, res);
        expect(repository.getDatasetById).toHaveBeenCalledWith(req.params.id);
    });

    it("returns a 404 error when dataset not found", async () => {
        repository.getDatasetById = jest.fn().mockImplementationOnce(() => {
            throw new ItemNotFound();
        });

        await DatasetCtrl.getDatasetById(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith("Dataset not found");
    });
});

describe("createDataset", () => {
    let req: Request;
    beforeEach(() => {
        req = {
            user,
            body: {
                fileName: "covid-dataset.csv",
                s3Key: {
                    raw: "123.csv",
                    json: "123.json",
                },
            },
        } as any as Request;
    });

    it("returns a 400 error when fileName is missing", async () => {
        delete req.body.fileName;
        await DatasetCtrl.createDataset(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required field `fileName`");
    });

    it("returns a 400 error when s3Key.raw is missing", async () => {
        delete req.body.s3Key.raw;
        await DatasetCtrl.createDataset(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required field `s3Key`");
    });

    it("returns a 400 error when s3Key.json is missing", async () => {
        delete req.body.s3Key.json;
        await DatasetCtrl.createDataset(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required field `s3Key`");
    });

    it("returns a 400 error if the provided schema is unknown", async () => {
        req.body.schema = "banana";
        await DatasetCtrl.createDataset(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Unknown schema provided 'banana'");
    });

    it("returns a 400 error if the provided schema is unknown and escapes html characters from the schema", async () => {
        req.body.schema = "<script>banana</script>";
        await DatasetCtrl.createDataset(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(
            "Unknown schema provided '&lt;script&gt;banana&lt;/script&gt;'",
        );
    });

    it("builds a new dataset object", async () => {
        jest.spyOn(DatasetFactory, "createNew");
        await DatasetCtrl.createDataset(req, res);
        expect(DatasetFactory.createNew).toBeCalledWith({
            fileName: "covid-dataset.csv",
            createdBy: "johndoe",
            s3Key: {
                raw: "123.csv",
                json: "123.json",
            },
            sourceType: "FileUpload",
        });
    });

    it("builds a new dataset object with schema", async () => {
        req.body.schema = "Metrics";
        jest.spyOn(DatasetFactory, "createNew");
        await DatasetCtrl.createDataset(req, res);
        expect(DatasetFactory.createNew).toBeCalledWith({
            fileName: "covid-dataset.csv",
            createdBy: "johndoe",
            s3Key: {
                raw: "123.csv",
                json: "123.json",
            },
            sourceType: "FileUpload",
            schema: "Metrics",
        });
    });

    it("saves the dataset", async () => {
        await DatasetCtrl.createDataset(req, res);
        expect(repository.saveDataset).toBeCalledWith(
            expect.objectContaining({
                id: expect.anything(),
                fileName: "covid-dataset.csv",
                createdBy: "johndoe",
            }),
        );
    });
});
