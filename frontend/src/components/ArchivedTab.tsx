import React, { useState, useCallback } from "react";
import { Dashboard } from "../models";
import { useDateTimeFormatter, useSettings } from "../hooks";
import Search from "./Search";
import ScrollTop from "./ScrollTop";
import Link from "./Link";
import Table from "./Table";

interface Props {
  dashboards: Array<Dashboard>;
}

function ArchivedTab(props: Props) {
  const [filter, setFilter] = useState("");
  const [, setSelected] = useState<Array<Dashboard>>([]);
  const { settings } = useSettings();
  const dateFormatter = useDateTimeFormatter();
  const { dashboards } = props;

  const onSearch = (query: string) => {
    setFilter(query);
  };

  const onSelect = useCallback((selectedDashboards: Array<Dashboard>) => {
    setSelected(selectedDashboards);
  }, []);

  return (
    <div>
      <p>
        These are your organization's archived dashboards. Archived dashboards
        are not viewable on the published site. Click on any dashboard name to
        view the dashboard. You can also re-publish archived dashboards to the
        published site.
      </p>
      <div className="grid-row margin-y-3">
        <div className="tablet:grid-col-7 text-left padding-top-1px">
          <ul className="usa-button-group">
            <li className="usa-button-group__item">
              <span>
                <Search id="search" onSubmit={onSearch} size="small" />
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
              Header: "Dashboard name",
              accessor: "name",
              Cell: (props: any) => {
                const dashboard = props.row.original as Dashboard;
                return (
                  <Link to={`/admin/dashboard/${dashboard.id}`}>
                    <span className="text-bold text-base-darkest">
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
              Header: "Last Updated",
              accessor: "updatedAt",
              Cell: (props: any) => dateFormatter(props.value),
            },
            {
              Header: "Created by",
              accessor: "createdBy",
            },
          ],
          [dateFormatter, settings]
        )}
      />
      <div className="text-right">
        <ScrollTop />
      </div>
    </div>
  );
}

export default ArchivedTab;
