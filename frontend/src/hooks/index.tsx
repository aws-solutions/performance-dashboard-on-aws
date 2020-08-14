import { useEffect, useState } from "react";
import { TopicArea, Dashboard, Widget } from "../models";
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

type UseDashboardHook = {
  loading: boolean;
  dashboard?: Dashboard;
};

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

type UseDashboardsHook = {
  loading: boolean;
  dashboards: Array<Dashboard>;
};

export function useDashboards(): UseDashboardsHook {
  const [loading, setLoading] = useState(false);
  const [dashboards, setDashboards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await BadgerService.fetchDashboards();
      setDashboards(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return {
    loading,
    dashboards,
  };
}

type UseWidgetsHook = {
  loading: boolean;
  widgets: Array<Widget>;
  setWidgets: Function;
};

export function useWidgets(dashboardId: string): UseWidgetsHook {
  const [loading, setLoading] = useState(false);
  const [widgets, setWidgets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await BadgerService.fetchWidgets(dashboardId);
      setWidgets(data);
      setLoading(false);
    };
    fetchData();
  }, [dashboardId]);

  return {
    loading,
    widgets,
    setWidgets,
  };
}
