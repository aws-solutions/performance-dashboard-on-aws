import { useEffect, useState, useCallback } from "react";
import {
  Dashboard,
  DashboardAuditLog,
  DashboardState,
  DashboardVersion,
  PublicDashboard,
} from "../models";
import BackendService from "../services/BackendService";
import AuditTrailService from "../services/AuditTrailService";
import FriendlyURLGenerator from "../services/FriendlyURLGenerator";

type UseDashboardHook = {
  loading: boolean;
  dashboard?: Dashboard;
  reloadDashboard: Function;
  setDashboard: Function;
};

export function useDashboard(dashboardId: string): UseDashboardHook {
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<Dashboard | undefined>(undefined);

  const fetchData = useCallback(
    async (updateLoading: boolean = true) => {
      updateLoading && setLoading(true);
      const data = await BackendService.fetchDashboardById(dashboardId);
      updateLoading && setLoading(false);
      if (data) {
        data.widgets.sort((a, b) => a.order - b.order);
        setDashboard(data);
      }
      document.getElementById("Home")?.focus();
    },
    [dashboardId]
  );

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
  archivedDashboards: Array<Dashboard>;
  reloadDashboards: Function;
};

export function useDashboards(): UseDashboardsHook {
  const [loading, setLoading] = useState(false);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [draftsDashboards, setDraftsDashboards] = useState<Dashboard[]>([]);
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
        data.filter(
          (dashboard) =>
            dashboard.state === DashboardState.Draft ||
            dashboard.state === DashboardState.PublishPending
        )
      );

      setPublishedDashboards(
        data.filter((dashboard) => dashboard.state === DashboardState.Published)
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
    archivedDashboards,
    reloadDashboards: fetchData,
  };
}

type UsePublicDashboardHook = {
  loading: boolean;
  dashboard?: PublicDashboard;
  reloadDashboard: Function;
  dashboardNotFound?: boolean;
};

export function usePublicDashboard(
  friendlyURL: string
): UsePublicDashboardHook {
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [dashboard, setDashboard] = useState<PublicDashboard | undefined>(
    undefined
  );

  const setDashboardAndSortWidgets = (dashboard: PublicDashboard) => {
    if (dashboard) {
      dashboard.widgets.sort((a, b) => a.order - b.order);
      setDashboard(dashboard);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await BackendService.fetchPublicDashboardByURL(friendlyURL);
      setDashboardAndSortWidgets(data);
    } catch (error) {
      try {
        /**
         * If fetching the dashboard by URL fails. Try loading the dashboard
         * by ID as a last resource. This allows us to be backwards compatible
         * so dashboards that don't currently have a friendlyURL can still
         * load for public users. We may remove this in the future.
         */
        const dashboardId = friendlyURL; // use the friendlyURL as an ID
        const data = await BackendService.fetchPublicDashboard(dashboardId);
        setDashboardAndSortWidgets(data);
      } catch (err) {
        /**
         * If fetching the dashboard by ID did not work either. Then consider
         * we can consider the dashboard to be NotFound.
         */
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    } finally {
      setLoading(false);
    }
  }, [friendlyURL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading,
    dashboard,
    reloadDashboard: fetchData,
    dashboardNotFound: notFound,
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

type UseHistoryHook = {
  loading: boolean;
  auditlogs: DashboardAuditLog[];
};

export function useDashboardHistory(
  parentDashboardId?: string
): UseHistoryHook {
  const [loading, setLoading] = useState<boolean>(false);
  const [auditlogs, setAuditlogs] = useState<DashboardAuditLog[]>([]);

  useEffect(() => {
    if (parentDashboardId) {
      const fetchData = async () => {
        setLoading(true);
        const data = await BackendService.fetchDashboardHistory(
          parentDashboardId
        );

        // Filter out noisy logs first
        const logs = AuditTrailService.removeNosiyAuditLogs(
          data as DashboardAuditLog[]
        );

        setAuditlogs(logs);
        setLoading(false);
      };
      fetchData();
    }
  }, [parentDashboardId]);

  return {
    loading,
    auditlogs,
  };
}

type UseFriendlyUrlHook = {
  friendlyURL: string;
};

export function useFriendlyUrl(
  dashboard?: Dashboard,
  versions?: DashboardVersion[]
): UseFriendlyUrlHook {
  const [friendlyURL, setFriendlyURL] = useState("");
  useEffect(() => {
    if (dashboard) {
      const published = versions?.find(
        (version) => version.state === DashboardState.Published
      );

      if (dashboard.friendlyURL) {
        setFriendlyURL(dashboard.friendlyURL);
      } else if (published && published.friendlyURL) {
        setFriendlyURL(published.friendlyURL);
      } else {
        setFriendlyURL(
          FriendlyURLGenerator.generateFromDashboardName(dashboard.name)
        );
      }
    }
  }, [dashboard, versions]);

  return {
    friendlyURL,
  };
}
