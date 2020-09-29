import { useEffect, useState, useCallback } from "react";
import { Dashboard } from "../models";
import BadgerService from "../services/BadgerService";

type UseDashboardHook = {
  loading: boolean;
  dashboard?: Dashboard;
  reloadDashboard: Function;
  setDashboard: Function;
};

export function useDashboard(dashboardId: string): UseDashboardHook {
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<Dashboard | undefined>(undefined);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await BadgerService.fetchDashboardById(dashboardId);
    setLoading(false);
    if (data) {
      data.widgets.sort((a, b) => a.order - b.order);
      setDashboard(data);
    }
  }, [dashboardId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading,
    dashboard,
    setDashboard,
    reloadDashboard: fetchData,
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
