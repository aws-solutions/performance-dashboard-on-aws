import { useEffect, useState, useCallback } from "react";
import { Dashboard, PublicDashboard } from "../models";
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
  draftsDashboards: Array<Dashboard> | undefined;
  publishedDashboards: Array<Dashboard> | undefined;
  reloadDashboard: Function;
};

export function useDashboards(): UseDashboardsHook {
  const [loading, setLoading] = useState(false);
  const [dashboards, setDashboards] = useState([]);
  const [draftsDashboards, setDraftsDashboards] = useState<
    Array<Dashboard> | undefined
  >(undefined);
  const [publishedDashboards, setPublishedDashboards] = useState<
    Array<Dashboard> | undefined
  >(undefined);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setDraftsDashboards(undefined);
    setPublishedDashboards(undefined);
    const data = await BadgerService.fetchDashboards();
    setLoading(false);
    if (data) {
      setDraftsDashboards(data.filter((d: Dashboard) => d.state === "Draft"));
      setPublishedDashboards(
        data.filter((d: Dashboard) => d.state === "Published")
      );
      setDashboards(data);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading,
    dashboards,
    draftsDashboards,
    publishedDashboards,
    reloadDashboard: fetchData,
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
