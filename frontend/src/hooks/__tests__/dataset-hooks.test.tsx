/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, act, screen } from "@testing-library/react";
import { useDatasets, useJsonDataset, useSampleDataset } from "../dataset-hooks";
import BackendService from "../../services/BackendService";
import StorageService from "../../services/StorageService";
import Papa from "papaparse";
import { Dataset, DatasetSchema, SourceType } from "../../models";

jest.mock("papaparse");

describe("useDatasets", () => {
    const FooComponent = () => {
        const { datasets } = useDatasets();
        return (
            <>
                <span>{datasets?.length}</span>
            </>
        );
    };

    test("should fetch datasets", async () => {
        const datasetSamples: Dataset[] = [
            {
                id: "ingest-api",
                fileName: "ingest-api",
                s3Key: { raw: "raw", json: "json" },
                sourceType: SourceType.IngestApi,
                schema: DatasetSchema.None,
            },
            {
                id: "ingest-api-metrics",
                fileName: "ingest-api-metrics",
                s3Key: { raw: "raw", json: "json" },
                sourceType: SourceType.IngestApi,
                schema: DatasetSchema.Metrics,
            },
            {
                id: "file-upload",
                fileName: "file-upload",
                s3Key: { raw: "raw", json: "json" },
                sourceType: SourceType.FileUpload,
                schema: DatasetSchema.None,
            },
        ];
        const fetchDatasetsSpy = jest
            .spyOn(BackendService, "fetchDatasets")
            .mockImplementation(() => Promise.resolve(datasetSamples));

        await act(async () => {
            render(<FooComponent />);
        });

        expect(fetchDatasetsSpy).toHaveBeenCalled();
        expect(screen.getByText(datasetSamples.length)).toBeInTheDocument();
    });
});

describe("useJsonDataset", () => {
    interface Props {
        s3Key: string;
    }
    const FooComponent = (props: Props) => {
        const { json } = useJsonDataset(props.s3Key);
        return (
            <>
                <span>{Object.keys(json).length}</span>
            </>
        );
    };

    test("should fetch json", async () => {
        const sampleJson = '{"sample": 500}';
        const downloadJsonSpy = jest
            .spyOn(StorageService, "downloadJson")
            .mockImplementation(() => Promise.resolve(JSON.parse(sampleJson)));

        await act(async () => {
            render(<FooComponent s3Key="/somekey.json" />);
        });

        expect(downloadJsonSpy).toHaveBeenCalled();
        expect(screen.getByText(1)).toBeInTheDocument();
    });
});

describe("useSampleDataset", () => {
    interface Props {
        sampleCSV: string;
    }
    const FooComponent = (props: Props) => {
        const { dataset } = useSampleDataset(props.sampleCSV);
        return (
            <>
                <span>{dataset.headers.length}</span>
            </>
        );
    };

    test("should fetch json", async () => {
        const parseSpy = jest.spyOn(Papa, "parse");

        await act(async () => {
            render(<FooComponent sampleCSV="/dataset.csv" />);
        });

        expect(parseSpy).toHaveBeenCalled();
        expect(screen.getByText(0)).toBeInTheDocument();
    });
});
