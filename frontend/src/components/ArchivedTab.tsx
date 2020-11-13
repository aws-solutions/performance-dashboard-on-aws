import React, { useState } from "react";
import { Dashboard, DashboardState } from "../models";
import Search from "./Search";
import DashboardsTable from "./DashboardsTable";
import ScrollTop from "./ScrollTop";

interface Props {
  dashboards: Array<Dashboard>;
}

function ArchivedTab(props: Props) {
  const [filter, setFilter] = useState("");
  const [, setSelected] = useState<Array<Dashboard>>([]);

  const onSearch = (query: string) => {
    setFilter(query);
  };

  const onSelect = (selectedDashboards: Array<Dashboard>) => {
    setSelected(selectedDashboards);
  };

  const filterDashboards = (dashboards: Array<Dashboard>): Array<Dashboard> => {
    return dashboards.filter((dashboard) => {
      const name = dashboard.name.toLowerCase().trim();
      const topicAreaName = dashboard.topicAreaName.toLowerCase().trim();
      const createdBy = dashboard.createdBy.toLowerCase().trim();
      const query = filter.toLowerCase();
      return (
        name.includes(query) ||
        topicAreaName.includes(query) ||
        createdBy.includes(query)
      );
    });
  };

  const sortDashboards = (dashboards: Array<Dashboard>): Array<Dashboard> => {
    return [...dashboards].sort((a, b) => {
      return a.updatedAt > b.updatedAt ? -1 : 1;
    });
  };

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
      <DashboardsTable
        dashboards={sortDashboards(filterDashboards(props.dashboards))}
        dashboardsState={DashboardState.Archived}
        onSelect={onSelect}
      />
      <div className="text-right">
        <ScrollTop />
      </div>
    </div>
  );
}

export default ArchivedTab;
