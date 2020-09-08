import React from "react";
import { useHistory } from "react-router-dom";
import { useDashboards } from "../hooks";
import AdminLayout from "../layouts/Admin";
import Button from "../components/Button";
import Search from "../components/Search";
import DashboardsTable from "../components/DashboardsTable";
import ScrollTop from "../components/ScrollTop";

function DashboardListing() {
  const { dashboards } = useDashboards();
  const history = useHistory();

  const createDashboard = () => {
    history.push("/admin/dashboard/create");
  };

  const onSearch = (query: string) => {
    console.log(query);
  };

  return (
    <AdminLayout>
      <h1>Dashboards</h1>
      <p>
        You have access to view, edit, and/or publish the draft dashboards in
        this table.
      </p>
      <div className="grid-row margin-y-4">
        <div className="grid-col-3 padding-top-2px">
          <Search id="search" onSubmit={onSearch} />
        </div>
        <div className="grid-col-3"></div>
        <div className="grid-col-6 text-right">
          <Button onClick={createDashboard}>Create dashboard</Button>
        </div>
      </div>
      <DashboardsTable dashboards={dashboards} />
      <div className="text-right">
        <ScrollTop />
      </div>
    </AdminLayout>
  );
}

export default DashboardListing;
