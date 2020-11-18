import { useEffect, useState } from "react";
import Papa, { ParseResult } from "papaparse";
import StorageService from "../services/StorageService";

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
        complete: (results: ParseResult<object>) => {
          if (results.errors.length === 0) {
            setDataset({
              data: results.data,
              headers: Object.keys(results.data[0]) as string[],
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
