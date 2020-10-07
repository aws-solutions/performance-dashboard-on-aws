import React from "react";
import { useDashboards } from "../hooks";
import AdminLayout from "../layouts/Admin";
import Tabs from "../components/Tabs";
import DraftsTab from "../components/DraftsTab";
import PublishedTab from "../components/PublishedTab";
import { useLocation } from "react-router-dom";

function DashboardListing() {
  const { search } = useLocation();
  const { draftsDashboards, publishedDashboards } = useDashboards();

  if (!draftsDashboards || !publishedDashboards) {
    return null;
  }

  const draftsTab = `Drafts (${draftsDashboards.length})`;
  const publishedTab = `Published (${publishedDashboards.length})`;

  let defaultActive = draftsTab;

  const queryString = search.split("=");
  if (queryString.length > 1 && queryString[1] === "published") {
    defaultActive = publishedTab;
  }

  return (
    <AdminLayout>
      <h1>Dashboards</h1>
      <Tabs defaultActive={defaultActive}>
        <div label={draftsTab}>
          <DraftsTab dashboards={draftsDashboards} />
        </div>
        <div label={publishedTab}>
          <PublishedTab dashboards={publishedDashboards} />
        </div>
      </Tabs>
    </AdminLayout>
  );
}

export default DashboardListing;
