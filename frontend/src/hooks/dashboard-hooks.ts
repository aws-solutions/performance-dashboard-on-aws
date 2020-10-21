import { useEffect, useState, useCallback } from "react";
import { Dashboard, DashboardState, PublicDashboard } from "../models";
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
  draftsDashboards: Array<Dashboard>;
  publishedDashboards: Array<Dashboard>;
  pendingDashboards: Array<Dashboard>;
  reloadDashboards: Function;
};

export function useDashboards(): UseDashboardsHook {
  const [loading, setLoading] = useState(false);
  const [dashboards, setDashboards] = useState<Array<Dashboard>>([]);
  const [draftsDashboards, setDraftsDashboards] = useState<Array<Dashboard>>([]);
  const [publishedDashboards, setPublishedDashboards] = useState<Array<Dashboard>>([]);
  const [pendingDashboards, setPendingDashboards] = useState<Array<Dashboard>>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await BadgerService.fetchDashboards();
    if (data) {
      setDraftsDashboards(data.filter((d) => d.state === DashboardState.Draft));
      setPublishedDashboards(data.filter((d) => d.state === DashboardState.Published));
      setPendingDashboards(data.filter((d) => d.state === DashboardState.PublishPending));
      setDashboards(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading,
    dashboards,
    draftsDashboards,
    publishedDashboards,
    pendingDashboards,
    reloadDashboards: fetchData,
  };
}

type UsePublicDashboardHook = {
  loading: boolean;
  dashboard?: PublicDashboard;
  reloadDashboard: Function;
};

export function usePublicDashboard(
  dashboardId: string
): UsePublicDashboardHook {
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<PublicDashboard | undefined>(
    undefined
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await BadgerService.fetchPublicDashboard(dashboardId);
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
    reloadDashboard: fetchData,
  };
}
