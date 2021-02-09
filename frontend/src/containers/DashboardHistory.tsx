import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  useDashboard,
  useDashboardHistory,
  useDateTimeFormatter,
} from "../hooks";
import Breadcrumbs from "../components/Breadcrumbs";
import Table from "../components/Table";
import Spinner from "../components/Spinner";

interface PathParams {
  dashboardId: string;
}

function DashboardHistory() {
  const { dashboardId } = useParams<PathParams>();
  const dateFormatter = useDateTimeFormatter();
  const { dashboard } = useDashboard(dashboardId);
  const { auditlogs } = useDashboardHistory(dashboard?.parentDashboardId);

  const tableColumns = useMemo(
    () => [
      {
        Header: "Action",
        accessor: "event",
      },
      {
        Header: "Dashboard version",
        accessor: "version",
      },
      {
        Header: "Date",
        accessor: "timestamp",
        Cell: (props: any) => dateFormatter(props.value),
      },
      {
        Header: "User",
        accessor: "userId",
      },
    ],
    []
  );

  if (!dashboard) {
    return <Spinner label="Loading..." />;
  }

  return (
    <>
      <Breadcrumbs
        crumbs={[
          {
            label: "Dashboards",
            url: "/admin/dashboards",
          },
          {
            label: dashboard?.name,
            url: `/admin/dashboard/${dashboardId}`,
          },
          {
            label: "History",
          },
        ]}
      />
      <h1>History</h1>

      <Table
        width="100%"
        selection="none"
        rows={auditlogs}
        initialSortByField="timestamp"
        columns={tableColumns}
      />
    </>
  );
}

export default DashboardHistory;
