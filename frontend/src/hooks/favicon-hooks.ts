import { useEffect, useState, useCallback } from "react";
import StorageService from "../services/StorageService";
import { useTranslation } from "react-i18next";

type UseFaviconHook = {
  loadingFile: boolean;
  favicon: File | undefined;
};

export function useFavicon(s3Key?: string): UseFaviconHook {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [favicon, setFile] = useState<File>();

  const fetchData = useCallback(async () => {
    if (s3Key) {
      try {
        setLoading(true);
        const data = await StorageService.downloadFavicon(s3Key, t);
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
