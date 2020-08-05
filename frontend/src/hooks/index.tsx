import { useEffect, useState } from "react";
import { TopicArea, Dashboard } from "../models";
import BadgerService from "../services/BadgerService";

/**
 * No unit tests for custom hooks?
 *
 * Custom hooks cannot be tested in isolation because React enforces
 * the use of hooks only inside functional components. Invoking a
 * custom hook within a unit test results in an Invalid Hook Call Warning
 * https://reactjs.org/warnings/invalid-hook-call-warning.html.
 */

type UseTopicAreasHook = {
  loading: boolean;
  topicareas: Array<TopicArea>;
};

/**
 * Custom React hook to fetch a list of topic areas.
 */
export function useTopicAreas(): UseTopicAreasHook {
  const [loading, setLoading] = useState(false);
  const [topicareas, setTopicAreas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await BadgerService.fetchTopicAreas();
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

/**
 * Hook to fetch a dashboard by topicAreaId and dashboardId
 */
type UseDashboardHook = {
  loading: boolean;
  dashboard?: Dashboard,
}

export function useDashboard(dashboardId: string): UseDashboardHook {
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await BadgerService.fetchDashboardById(dashboardId);
      setDashboard(data);
      setLoading(false);
    };
    fetchData();
  }, [dashboardId]);

  return {
    loading,
    dashboard,
  };
}
