/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from "react";
import Papa, { ParseResult } from "papaparse";
import StorageService from "../services/StorageService";
import { Dataset, DatasetSchema, SourceType } from "../models";
import BackendService from "../services/BackendService";

type UseDatasetsHook = {
    loadingDatasets: boolean;
    datasets: Array<Dataset>;
    dynamicDatasets: Array<Dataset>;
    dynamicMetricDatasets: Array<Dataset>;
    staticDatasets: Array<Dataset>;
    reloadDatasets: Function;
};

export function useDatasets(): UseDatasetsHook {
    const [loadingDatasets, setLoadingDatasets] = useState(false);
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [dynamicDatasets, setDynamicDatasets] = useState<Dataset[]>([]);
    const [dynamicMetricDatasets, setDynamicMetricDatasets] = useState<Dataset[]>([]);
    const [staticDatasets, setStaticDatasets] = useState<Dataset[]>([]);

    const fetchData = useCallback(async () => {
        setLoadingDatasets(true);
        const data = await BackendService.fetchDatasets();
        if (data) {
            setDatasets(data);
            setDynamicDatasets(
                data.filter(
                    (dataset) =>
                        dataset.sourceType === SourceType.IngestApi &&
                        dataset.schema === DatasetSchema.None,
                ),
            );

            setDynamicMetricDatasets(
                data.filter(
                    (dataset) =>
                        dataset.sourceType === SourceType.IngestApi &&
                        dataset.schema === DatasetSchema.Metrics,
                ),
            );

            setStaticDatasets(
                data.filter(
                    (dataset) =>
                        (!dataset.sourceType || dataset.sourceType === SourceType.FileUpload) &&
                        dataset.schema === DatasetSchema.None,
                ),
            );
        }
        setLoadingDatasets(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        loadingDatasets,
        datasets,
        dynamicDatasets,
        dynamicMetricDatasets,
        staticDatasets,
        reloadDatasets: fetchData,
    };
}

type UseJsonDatasetHook = {
    loading: boolean;
    json: Array<any>;
};

export function useJsonDataset(s3Key: string): UseJsonDatasetHook {
    const [loading, setLoading] = useState<boolean>(false);
    const [json, setJson] = useState<Array<any>>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await StorageService.downloadJson(s3Key);
            setJson(data);
            setLoading(false);
        };
        fetchData();
    }, [s3Key]);

    return {
        loading,
        json,
    };
}

type SampleDataset = {
    headers: Array<string>;
    data: Array<any>;
};

type SampleDatasetsHook = {
    loading: boolean;
    dataset: SampleDataset;
};

export function useSampleDataset(sampleCSV: string): SampleDatasetsHook {
    const [loading, setLoading] = useState<boolean>(false);
    const [dataset, setDataset] = useState<SampleDataset>({
        data: [],
        headers: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            Papa.parse(`${process.env.PUBLIC_URL}/samplecsv/${sampleCSV}`, {
                download: true,
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                comments: "#",
                encoding: "ISO-8859-1",
                complete: (results: ParseResult<object>) => {
                    if (results.errors.length === 0) {
                        setDataset({
                            data: results.data,
                            headers: Object.keys(results.data[0]),
                        });
                    }
                },
            });
            setLoading(false);
        };
        fetchData();
    }, [sampleCSV]);

    return {
        loading,
        dataset,
    };
}
