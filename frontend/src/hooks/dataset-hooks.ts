import { useEffect, useState } from "react";
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
