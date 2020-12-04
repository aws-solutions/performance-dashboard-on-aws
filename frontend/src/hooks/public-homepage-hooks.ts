import { useEffect, useState } from "react";
import { PublicHomepage } from "../models";
import BackendService from "../services/BackendService";

type UsePublicHomepageHook = {
  loading: boolean;
  homepage: PublicHomepage;
};

export function usePublicHomepage(): UsePublicHomepageHook {
  const [loading, setLoading] = useState<boolean>(false);
  const [homepage, setHomepage] = useState<PublicHomepage>({
    title: "",
    description: "",
    dashboards: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await BackendService.fetchPublicHomepage();
      setHomepage(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return {
    loading,
    homepage,
  };
}
