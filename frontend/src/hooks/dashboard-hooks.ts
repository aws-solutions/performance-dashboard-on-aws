import { useEffect, useState, useCallback } from "react";
import {
  Dashboard,
  DashboardState,
  DashboardVersion,
  PublicDashboard,
} from "../models";
import BackendService from "../services/BackendService";

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
    const data = await BackendService.fetchDashboardById(dashboardId);
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
  archivedDashboards: Array<Dashboard>;
  reloadDashboards: Function;
};

export function useDashboards(): UseDashboardsHook {
  const [loading, setLoading] = useState(false);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [draftsDashboards, setDraftsDashboards] = useState<Dashboard[]>([]);
  const [pendingDashboards, setPendingDashboards] = useState<Dashboard[]>([]);
  const [publishedDashboards, setPublishedDashboards] = useState<Dashboard[]>(
    []
  );
  const [archivedDashboards, setArchivedDashboards] = useState<Dashboard[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await BackendService.fetchDashboards();
    if (data) {
      setDashboards(data);
      setDraftsDashboards(
        data.filter((dashboard) => dashboard.state === DashboardState.Draft)
      );

      setPublishedDashboards(
        data.filter((dashboard) => dashboard.state === DashboardState.Published)
      );

      setPendingDashboards(
        data.filter(
          (dashboard) => dashboard.state === DashboardState.PublishPending
        )
      );

      setArchivedDashboards(
        data.filter((dashboard) => dashboard.state === DashboardState.Archived)
      );
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
    archivedDashboards,
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
    let data = undefined;
    try {
      data = await BackendService.fetchPublicDashboard(dashboardId);
      if (data) {
        data.widgets.sort((a, b) => a.order - b.order);
        setDashboard(data);
      }
    } catch (error) {
      data = {};
      setDashboard(data as PublicDashboard);
    }
    setLoading(false);
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

type UseVersionsHook = {
  loading: boolean;
  versions: Array<DashboardVersion>;
};

export function useDashboardVersions(
  parentDashboardId: string | undefined
): UseVersionsHook {
  const [loading, setLoading] = useState<boolean>(false);
  const [versions, setVersions] = useState<DashboardVersion[]>([]);

  useEffect(() => {
    if (parentDashboardId) {
      const fetchData = async () => {
        setLoading(true);
        const data = await BackendService.fetchDashboardVersions(
          parentDashboardId
        );
        setVersions(data);
        setLoading(false);
      };
      fetchData();
    }
  }, [parentDashboardId]);

  return {
    loading,
    versions,
  };
}
