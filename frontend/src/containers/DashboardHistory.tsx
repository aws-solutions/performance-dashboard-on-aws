import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import Table from "../components/Table";
import Spinner from "../components/Spinner";
import AuditTrailService from "../services/AuditTrailService";
import Search from "../components/Search";
import {
  useDashboard,
  useDashboardHistory,
  useDateTimeFormatter,
} from "../hooks";

interface PathParams {
  dashboardId: string;
}

function DashboardHistory() {
  const [filter, setFilter] = useState("");
  const { dashboardId } = useParams<PathParams>();
  const dateFormatter = useDateTimeFormatter();
  const { dashboard } = useDashboard(dashboardId);
  const { auditlogs } = useDashboardHistory(dashboard?.parentDashboardId);

  const tableColumns = useMemo(
    () => [
      {
        Header: "Action",
        accessor: (props: any) => {
          return AuditTrailService.getActionFromDashboardAuditLog(props);
        },
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

  const onSearch = (query: string) => {
    setFilter(query);
  };

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

      <div className="grid-row margin-y-3">
        <div className="tablet:grid-col-3 padding-top-1px">
          <Search id="search" onSubmit={onSearch} size="small" />
        </div>
        <div className="tablet:grid-col-9 text-right">&nbsp;</div>
      </div>

      <Table
        width="100%"
        selection="none"
        rows={auditlogs}
        initialSortAscending={false}
        initialSortByField="timestamp"
        columns={tableColumns}
        filterQuery={filter}
      />
    </>
  );
}

export default DashboardHistory;
