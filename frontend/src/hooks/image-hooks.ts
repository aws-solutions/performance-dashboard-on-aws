import { useEffect, useState, useCallback } from "react";
import StorageService from "../services/StorageService";

type UseImageHook = {
  loadingFile: boolean;
  file: File | undefined;
};

export function useImage(s3Key: string): UseImageHook {
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File>();

  const fetchData = useCallback(async () => {
    if (s3Key) {
      setLoading(true);
      const data = await StorageService.downloadFile(s3Key);
      setFile(data);
      setLoading(false);
    }
  }, [s3Key]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loadingFile: loading,
    file,
  };
}
