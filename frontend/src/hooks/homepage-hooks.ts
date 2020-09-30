import { useEffect, useState } from "react";
import { Homepage } from "../models";
import BadgerService from "../services/BadgerService";

type UseHomepageHook = {
  loading: boolean;
  homepage: Homepage;
};

export function useHomepage(): UseHomepageHook {
  const [loading, setLoading] = useState<boolean>(false);
  const [homepage, setHomepage] = useState<Homepage>({
    title: "",
    description: "",
    dashboards: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await BadgerService.fetchHomepage();
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
