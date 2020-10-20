import React from "react";
import { useParams } from "react-router-dom";
import { useDashboard } from "../hooks";
import AlertContainer from "./AlertContainer";
import AdminLayout from "../layouts/Admin";

interface PathParams {
  dashboardId: string;
}

function PublishDashboard() {
  const { dashboardId } = useParams<PathParams>();
  const { dashboard } = useDashboard(dashboardId);

  if (!dashboard) {
    return null;
  }

  return (
    <AdminLayout>
      <AlertContainer />
      <div>
        <h1 className="margin-bottom-0 display-inline-block">
          {dashboard.name}
        </h1>
      </div>
    </AdminLayout>
  );
}

export default PublishDashboard;
