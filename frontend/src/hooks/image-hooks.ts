import { useEffect, useState } from "react";
import StorageService from "../services/StorageService";

type UseImageHook = {
  loading: boolean;
  file: File | undefined;
};

export function useImage(s3Key: string): UseImageHook {
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await StorageService.downloadFile(s3Key);
      setFile(data);
      setLoading(false);
    };
    fetchData();
  }, [s3Key]);

  return {
    loading,
    file,
  };
}
