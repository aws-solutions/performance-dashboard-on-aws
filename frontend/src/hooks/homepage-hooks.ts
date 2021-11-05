import { useEffect, useState } from "react";
import { Homepage, PublicHomepage } from "../models";
import BackendService from "../services/BackendService";

type UseHomepageHook = {
  loading: boolean;
  homepage: Homepage;
};

export function useHomepage(): UseHomepageHook {
  const [loading, setLoading] = useState<boolean>(false);
  const [homepage, setHomepage] = useState<Homepage>({
    title: "",
    description: "",
    updatedAt: new Date(),
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await BackendService.fetchHomepage();
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

type UsePublicHomepageSearchHook = {
  loading: boolean;
  homepage: PublicHomepage;
};

export function usePublicHomepageSearch(query :string)
    : UsePublicHomepageSearchHook {
  const [loading, setLoading] = useState<boolean>(false);
  const [homepage, setHomepage] = useState<PublicHomepage>({
    title: "",
    description: "",
    dashboards: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await BackendService.fetchPublicHomepageWithQuery(query);
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