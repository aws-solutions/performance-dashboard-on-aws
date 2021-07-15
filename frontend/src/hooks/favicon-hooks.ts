import { useEffect, useState, useCallback } from "react";
import StorageService from "../services/StorageService";

type UseFaviconHook = {
  loadingFile: boolean;
  favicon: File | undefined;
};

export function useFavicon(s3Key?: string): UseFaviconHook {
  const [loading, setLoading] = useState<boolean>(false);
  const [favicon, setFile] = useState<File>();

  const fetchData = useCallback(async () => {
    console.log("hello");
    console.log(s3Key);
    if (s3Key) {
      try {
        setLoading(true);
        const data = await StorageService.downloadFavicon(s3Key, () => {});
        setFile(data);
        setLoading(false);
      } catch (err) {
        console.log("Can't retrieve favicon from S3", err);
        setLoading(false);
      }
    }
  }, [s3Key]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loadingFile: loading,
    favicon,
  };
}
