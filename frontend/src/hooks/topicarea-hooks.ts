import { useEffect, useState } from "react";
import { TopicArea } from "../models";
import BackendService from "../services/BackendService";

type UseTopicAreasHook = {
  loading: boolean;
  topicareas: Array<TopicArea>;
};

export function useTopicAreas(): UseTopicAreasHook {
  const [loading, setLoading] = useState(false);
  const [topicareas, setTopicAreas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await BackendService.fetchTopicAreas();
      setTopicAreas(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return {
    loading,
    topicareas,
  };
}
