import React, { useState, useCallback } from "react";
import { Dashboard } from "../models";
import { useDateTimeFormatter, useSettings } from "../hooks";
import Search from "./Search";
import Link from "./Link";
import Table from "./Table";
import { useTranslation } from "react-i18next";

interface Props {
  dashboards: Array<Dashboard>;
}

function ArchivedTab(props: Props) {
  const [filter, setFilter] = useState("");
  const [, setSelected] = useState<Array<Dashboard>>([]);
  const { settings } = useSettings();
  const dateFormatter = useDateTimeFormatter();
  const { dashboards } = props;

  const { t } = useTranslation();

  const onSearch = (query: string) => {
    setFilter(query);
  };

  const onSelect = useCallback((selectedDashboards: Array<Dashboard>) => {
    setSelected(selectedDashboards);
  }, []);

  return (
    <div>
      <p>{t("ArchivedTabDescription")}</p>
      <div className="grid-row margin-y-3">
        <div className="tablet:grid-col-7 text-left padding-top-1px">
          <ul className="usa-button-group">
            <li className="usa-button-group__item">
              <span>
                <Search
                  id="search"
                  onSubmit={onSearch}
                  size="small"
                  placeholder={t("Search.SearchDashboards", {
                    state: t("archived"),
                  })}
                  label={t("Search.SearchDashboards", { state: t("archived") })}
                  wide={true}
                />
              </span>
            </li>
          </ul>
        </div>
      </div>
      <Table
        selection="none"
        initialSortByField="updatedAt"
        filterQuery={filter}
        rows={React.useMemo(() => dashboards, [dashboards])}
        screenReaderField="name"
        onSelection={onSelect}
        width="100%"
        columns={React.useMemo(
          () => [
            {
              Header: t("DashboardName"),
              accessor: "name",
              Cell: (props: any) => {
                const dashboard = props.row.original as Dashboard;
                return (
                  <Link to={`/admin/dashboard/${dashboard.id}`}>
                    <span className="text-bold text-base-darker">
                      {dashboard.name}
                    </span>
                  </Link>
                );
              },
            },
            {
              Header: settings.topicAreaLabels.singular,
              accessor: "topicAreaName",
            },
            {
              Header: t("LastUpdatedLabel"),
              accessor: "updatedAt",
              Cell: (props: any) => dateFormatter(props.value),
            },
            {
              Header: t("ArchivedBy"),
              accessor: "archivedBy",
            },
          ],
          [dateFormatter, settings, t]
        )}
      />
    </div>
  );
}

export default ArchivedTab;
