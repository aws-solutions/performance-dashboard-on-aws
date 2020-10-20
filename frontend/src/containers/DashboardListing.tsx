import React from "react";
import { useDashboards } from "../hooks";
import AdminLayout from "../layouts/Admin";
import Tabs from "../components/Tabs";
import DraftsTab from "../components/DraftsTab";
import PublishedTab from "../components/PublishedTab";
import { useLocation } from "react-router-dom";
import AlertContainer from "../containers/AlertContainer";
import { Dashboard } from "../models";
import BadgerService from "../services/BadgerService";

function DashboardListing() {
  const { search } = useLocation();
  const {
    draftsDashboards,
    publishedDashboards,
    reloadDashboard,
  } = useDashboards();

  if (!draftsDashboards || !publishedDashboards) {
    return null;
  }

  const onDeleteDraftDashboards = async (selected: Array<Dashboard>) => {
    if (
      window.confirm(
        `This will permanently delete ${
          selected.length > 1 ? selected.length : selected[0].name
        } draft dashboard${
          selected.length > 1 ? "s" : ""
        }. This action cannot be undone. Are you sure you want to continue?`
      )
    ) {
      if (selected.length) {
        await BadgerService.deleteDashboards(
          selected.map((dashboard) => dashboard.id)
        );
        await reloadDashboard();
      }
    }
  };

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
      <AlertContainer />
      <Tabs defaultActive={defaultActive}>
        <div label={draftsTab}>
          <DraftsTab
            dashboards={draftsDashboards}
            onDelete={onDeleteDraftDashboards}
          />
        </div>
        <div label={publishedTab}>
          <PublishedTab dashboards={publishedDashboards} />
        </div>
      </Tabs>
    </AdminLayout>
  );
}

export default DashboardListing;
