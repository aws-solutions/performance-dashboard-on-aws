import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDashboards } from "../hooks";
import { Dashboard } from "../models";
import AdminLayout from "../layouts/Admin";
import Button from "../components/Button";
import Search from "../components/Search";
import DashboardsTable from "../components/DashboardsTable";
import ScrollTop from "../components/ScrollTop";

function DashboardListing() {
  const { dashboards } = useDashboards();
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<Array<Dashboard>>([]);
  const history = useHistory();

  const createDashboard = () => {
    history.push("/admin/dashboard/create");
  };

  const onSearch = (query: string) => {
    setFilter(query);
  };

  const onSelect = (selectedDashboards: Array<Dashboard>) => {
    setSelected(selectedDashboards);
  };

  const filterDashboards = (dashboards: Array<Dashboard>): Array<Dashboard> => {
    return dashboards.filter((dashboard) => {
      const name = dashboard.name.toLowerCase().trim();
      const query = filter.toLowerCase();
      return name.includes(query);
    });
  };

  const sortDashboards = (dashboards: Array<Dashboard>): Array<Dashboard> => {
    return [...dashboards].sort((a, b) => {
      return a.updatedAt > b.updatedAt ? -1 : 1;
    });
  };

  return (
    <AdminLayout>
      <h1>Dashboards</h1>
      <p>
        You have access to view, edit, and/or publish the draft dashboards in
        this table.
      </p>
      <div className="grid-row margin-y-3">
        <div className="tablet:grid-col-3 padding-top-1px">
          <Search id="search" onSubmit={onSearch} size="small" />
        </div>
        <div className="tablet:grid-col-9 text-right">
          <span>
            <Button variant="base" disabled={selected.length === 0}>
              Delete
            </Button>
          </span>
          <span>
            <Button variant="base" disabled={selected.length === 0}>
              Publish
            </Button>
          </span>
          <span>
            <Button onClick={createDashboard}>Create dashboard</Button>
          </span>
        </div>
      </div>
      <DashboardsTable
        dashboards={sortDashboards(filterDashboards(dashboards))}
        onSelect={onSelect}
      />
      <div className="text-right">
        <ScrollTop />
      </div>
    </AdminLayout>
  );
}

export default DashboardListing;
