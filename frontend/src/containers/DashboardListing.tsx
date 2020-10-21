import React from "react";
import { useDashboards } from "../hooks";
import { LocationState } from "../models";
import AdminLayout from "../layouts/Admin";
import Tabs from "../components/Tabs";
import DraftsTab from "../components/DraftsTab";
import PublishedTab from "../components/PublishedTab";
import { useLocation, useHistory } from "react-router-dom";
import AlertContainer from "../containers/AlertContainer";
import { Dashboard } from "../models";
import BadgerService from "../services/BadgerService";
import PublishQueueTab from "../components/PublishQueueTab";

function DashboardListing() {
  const { search } = useLocation();
  const history = useHistory<LocationState>();
  const {
    draftsDashboards,
    publishedDashboards,
    pendingDashboards,
    reloadDashboards,
  } = useDashboards();

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

        history.replace("/admin/dashboards", {
          alert: {
            type: "info",
            message: `${
              selected.length > 1 ? selected.length : selected[0].name
            } draft dashboard${selected.length > 1 ? "s" : ""} ${
              selected.length > 1 ? "were" : "was"
            } successfully deleted`,
          },
        });

        await reloadDashboards();
      }
    }
  };

  let activeTab = "drafts";
  const validTabs = ["drafts", "published", "pending"];

  const queryString = search.split("tab=");
  if (queryString.length > 1 && validTabs.includes(queryString[1])) {
    activeTab = queryString[1];
  }

  return (
    <AdminLayout>
      <h1>Dashboards</h1>
      <AlertContainer />
      <Tabs defaultActive={activeTab}>
        <div id="drafts" label={`Drafts (${draftsDashboards.length})`}>
          <DraftsTab
            dashboards={draftsDashboards}
            onDelete={onDeleteDraftDashboards}
          />
        </div>
        <div id="pending" label={`Publish queue (${pendingDashboards.length})`}>
          <PublishQueueTab dashboards={pendingDashboards} />
        </div>
        <div id="published" label={`Published (${publishedDashboards.length})`}>
          <PublishedTab dashboards={publishedDashboards} />
        </div>
      </Tabs>
    </AdminLayout>
  );
}

export default DashboardListing;
