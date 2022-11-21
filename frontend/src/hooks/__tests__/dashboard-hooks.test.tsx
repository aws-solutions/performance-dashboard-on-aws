import React from "react";
import { render, act, screen } from "@testing-library/react";
import {
  useDashboard,
  useDashboards,
  usePublicDashboard,
  useDashboardVersions,
  useDashboardHistory,
  useFriendlyUrl,
} from "../dashboard-hooks";
import { Dashboard, DashboardState, DashboardVersion } from "../../models";
import BackendService from "../../services/BackendService";
import AuditTrailService from "../../services/AuditTrailService";
import FriendlyURLGenerator from "../../services/FriendlyURLGenerator";

const dashboards: Dashboard[] = [
  {
    id: "100",
    name: "Bananas Dashboard",
    topicAreaId: "fruits",
    topicAreaName: "Bananas",
    parentDashboardId: "01",
    description: "Some description",
    updatedAt: "2021-01-19T18:27:00Z",
    updatedBy: "johndoe",
    createdBy: "test user",
    state: DashboardState.Published,
    version: 1,
    widgets: [],
  },
  {
    id: "201",
    name: "Apple Dashboard",
    topicAreaId: "fruits",
    topicAreaName: "Apple",
    parentDashboardId: "01",
    description: "Some description",
    updatedAt: "2021-01-19T18:27:00Z",
    updatedBy: "johndoe",
    createdBy: "test user",
    state: DashboardState.Published,
    version: 1,
    widgets: [],
  },
];

describe("useDashboard", () => {
  interface Props {
    dashboardId: string;
  }
  const FooComponent = (props: Props) => {
    const { dashboard } = useDashboard(props.dashboardId);
    return (
      <>
        <span>{dashboard?.name}</span>
      </>
    );
  };

  test("should fetch Dashboard By Id", async () => {
    const selectedDashboard = dashboards[0];
    const fetchDashboardById = jest
      .spyOn(BackendService, "fetchDashboardById")
      .mockImplementation(() => Promise.resolve(selectedDashboard));

    await act(async () => {
      render(<FooComponent dashboardId={selectedDashboard.id} />);
    });

    expect(fetchDashboardById).toHaveBeenCalled();
    expect(screen.getByText(selectedDashboard.name)).toBeInTheDocument();
  });
});

describe("useDashboards", () => {
  const FooComponent = () => {
    const { dashboards } = useDashboards();
    return (
      <>
        <span>{dashboards?.length}</span>
      </>
    );
  };

  test("should fetch Dashboards", async () => {
    const fetchDashboards = jest
      .spyOn(BackendService, "fetchDashboards")
      .mockImplementation(() => Promise.resolve(dashboards));

    await act(async () => {
      render(<FooComponent />);
    });

    expect(fetchDashboards).toHaveBeenCalled();
    expect(screen.getByText(dashboards.length)).toBeInTheDocument();
  });
});

describe("usePublicDashboard", () => {
  interface Props {
    friendlyURL: string;
  }
  const FooComponent = (props: Props) => {
    const { dashboard, dashboardNotFound } = usePublicDashboard(
      props.friendlyURL
    );
    return (
      <>
        <span>{dashboard?.name || `${dashboardNotFound}`}</span>
      </>
    );
  };

  test("should fetch Dashboard by friendlyURL", async () => {
    const selectedDashboard = dashboards[0];
    const fetchPublicDashboardByURL = jest
      .spyOn(BackendService, "fetchPublicDashboardByURL")
      .mockImplementation(() => Promise.resolve(selectedDashboard));
    const fetchPublicDashboard = jest
      .spyOn(BackendService, "fetchPublicDashboard")
      .mockImplementation(() => Promise.resolve(selectedDashboard));

    await act(async () => {
      render(<FooComponent friendlyURL={selectedDashboard.friendlyURL} />);
    });

    expect(fetchPublicDashboardByURL).toHaveBeenCalled();
    expect(fetchPublicDashboard).toHaveBeenCalledTimes(0);
    expect(screen.getByText(selectedDashboard.name)).toBeInTheDocument();
  });

  test("should fetch Dashboard by id", async () => {
    const selectedDashboard = dashboards[0];
    const fetchPublicDashboardByURL = jest
      .spyOn(BackendService, "fetchPublicDashboardByURL")
      .mockImplementation(() => Promise.reject());
    const fetchPublicDashboard = jest
      .spyOn(BackendService, "fetchPublicDashboard")
      .mockImplementation(() => Promise.resolve(selectedDashboard));

    await act(async () => {
      render(<FooComponent friendlyURL={selectedDashboard.friendlyURL} />);
    });

    expect(fetchPublicDashboardByURL).toHaveBeenCalled();
    expect(fetchPublicDashboard).toHaveBeenCalled();
    expect(screen.getByText(selectedDashboard.name)).toBeInTheDocument();
  });

  test("should return not found", async () => {
    const fetchPublicDashboardByURL = jest
      .spyOn(BackendService, "fetchPublicDashboardByURL")
      .mockImplementation(() => Promise.reject());
    const fetchPublicDashboard = jest
      .spyOn(BackendService, "fetchPublicDashboard")
      .mockImplementation(() => Promise.reject());

    await act(async () => {
      render(<FooComponent friendlyURL="not-found" />);
    });

    expect(fetchPublicDashboardByURL).toHaveBeenCalled();
    expect(fetchPublicDashboard).toHaveBeenCalled();
    const dashboardNotFound = true;
    expect(screen.getByText(`${dashboardNotFound}`)).toBeInTheDocument();
  });
});

describe("useDashboardVersions", () => {
  interface Props {
    parentDashboardId: string;
  }
  const FooComponent = (props: Props) => {
    const { versions } = useDashboardVersions(props.parentDashboardId);
    return (
      <>
        <span>{versions?.length}</span>
      </>
    );
  };

  test("should fetch Dashboard Versions", async () => {
    const results: [] = [];
    const fetchDashboardVersions = jest
      .spyOn(BackendService, "fetchDashboardVersions")
      .mockImplementation(() => Promise.resolve(results));

    await act(async () => {
      render(<FooComponent parentDashboardId="0" />);
    });

    expect(fetchDashboardVersions).toHaveBeenCalled();
    expect(screen.getByText(results.length)).toBeInTheDocument();
  });
});

describe("useDashboardHistory", () => {
  interface Props {
    parentDashboardId: string;
  }
  const FooComponent = (props: Props) => {
    const { auditlogs } = useDashboardHistory(props.parentDashboardId);
    return (
      <>
        <span>{auditlogs?.length}</span>
      </>
    );
  };

  test("should fetch Dashboard history", async () => {
    const results: [] = [];
    const fetchDashboardHistory = jest
      .spyOn(BackendService, "fetchDashboardHistory")
      .mockImplementation(() => Promise.resolve(results));

    const removeNosiyAuditLogs = jest
      .spyOn(AuditTrailService, "removeNosiyAuditLogs")
      .mockReturnValue(results);

    await act(async () => {
      render(<FooComponent parentDashboardId="0" />);
    });

    expect(fetchDashboardHistory).toHaveBeenCalled();
    expect(removeNosiyAuditLogs).toHaveBeenCalled();
    expect(screen.getByText(results.length)).toBeInTheDocument();
  });
});

describe("useFriendlyUrl", () => {
  interface Props {
    dashboard: Dashboard;
    versions: DashboardVersion[];
  }
  const FooComponent = (props: Props) => {
    const { friendlyURL } = useFriendlyUrl(props.dashboard, props.versions);
    return (
      <>
        <span>{friendlyURL}</span>
      </>
    );
  };

  test("should fetch Dashboard history", async () => {
    const selectedDashboard = dashboards[0];
    const friendlyURL: string = "http://friendly.com";
    const generateFromDashboardName = jest
      .spyOn(FriendlyURLGenerator, "generateFromDashboardName")
      .mockReturnValue(friendlyURL);

    await act(async () => {
      render(<FooComponent dashboard={selectedDashboard} versions={[]} />);
    });

    expect(generateFromDashboardName).toHaveBeenCalled();
    expect(screen.getByText(friendlyURL)).toBeInTheDocument();
  });
});
