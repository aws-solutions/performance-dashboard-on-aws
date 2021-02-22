import { useEffect, useState, useCallback } from "react";
import ContentService from "../services/ContentService";

type UseLogoHook = {
  loadingFile: boolean;
  logo: File | undefined;
};

export function useLogo(s3Key: string | undefined): UseLogoHook {
  const [loading, setLoading] = useState<boolean>(false);
  const [logo, setFile] = useState<File>();

  const fetchData = useCallback(async () => {
    if (s3Key) {
      setLoading(true);
      const data = await ContentService.downloadFile(s3Key);
      setFile(data);
      setLoading(false);
    }
  }, [s3Key]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loadingFile: loading,
    logo,
  };
}
