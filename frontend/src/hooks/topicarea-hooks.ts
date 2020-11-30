import { useCallback, useEffect, useState } from "react";
import { TopicArea } from "../models";
import BackendService from "../services/BackendService";

type UseTopicAreasHook = {
  loading: boolean;
  topicareas: Array<TopicArea>;
  reloadTopicAreas: Function;
};

export function useTopicAreas(): UseTopicAreasHook {
  const [loading, setLoading] = useState(false);
  const [topicareas, setTopicAreas] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await BackendService.fetchTopicAreas();
    setTopicAreas(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading,
    topicareas,
    reloadTopicAreas: fetchData,
  };
}
