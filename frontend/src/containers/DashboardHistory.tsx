import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import Table from "../components/Table";
import Spinner from "../components/Spinner";
import AuditTrailService from "../services/AuditTrailService";
import UtilsService from "../services/UtilsService";
import Search from "../components/Search";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  const tableColumns = useMemo(
    () => [
      {
        Header: {t("HistoryScreen.Action")},
        accessor: (props: any) => {
          return AuditTrailService.getActionFromDashboardAuditLog(props);
        },
      },
      {
        Header: {t("HistoryScreen.DashboardVersion")},
        accessor: "version",
      },
      {
        Header: {t("HistoryScreen.Date")},
        accessor: "timestamp",
        Cell: (props: any) => dateFormatter(props.value),
      },
      {
        Header: {t("HistoryScreen.User")},
        accessor: "userId",
      },
    ],
    []
  );

  const onSearch = (query: string) => {
    setFilter(query);
  };

  if (!dashboard) {
    return <Spinner className="text-center margin-top-9" label={t("Loading")} />;
  }

  return (
    <>
      <Breadcrumbs
        crumbs={[
          {
            label: {t("Dashboards")},
            url: "/admin/dashboards",
          },
          {
            label: dashboard?.name,
            url: UtilsService.getDashboardUrlPath(dashboard),
          },
          {
            label: {t("History")},
          },
        ]}
      />
      <h1>{t("History")}</h1>

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
