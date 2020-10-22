import React from "react";
import { useDashboards } from "../hooks";
import { LocationState } from "../models";
import AdminLayout from "../layouts/Admin";
import Tabs from "../components/Tabs";
import DraftsTab from "../components/DraftsTab";
import PublishedTab from "../components/PublishedTab";
import PublishQueueTab from "../components/PublishQueueTab";
import ArchivedTab from "../components/ArchivedTab";
import { useLocation, useHistory } from "react-router-dom";
import AlertContainer from "../containers/AlertContainer";
import { Dashboard } from "../models";
import BadgerService from "../services/BadgerService";

function DashboardListing() {
  const { search } = useLocation();
  const history = useHistory<LocationState>();
  const {
    draftsDashboards,
    publishedDashboards,
    pendingDashboards,
    archivedDashboards,
    reloadDashboards,
  } = useDashboards();

  const onDeleteDraftDashboards = async (selected: Array<Dashboard>) => {
    if (
      window.confirm(
        `This will permanently delete "${
          selected.length > 1 ? selected.length : selected[0].name
        }" dashboard${
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

  const onArchivePublishedDashboards = async (selected: Array<Dashboard>) => {
    if (
      window.confirm(
        `This will remove "${
          selected.length > 1 ? selected.length : selected[0].name
        }" dashboard${
          selected.length > 1 ? "s" : ""
        } from the external site. You can re-publish archived dashboards at any time.`
      )
    ) {
      if (selected.length) {
        for (const dashboard of selected) {
          await BadgerService.archive(dashboard.id, dashboard.updatedAt);
        }

        history.replace("/admin/dashboards?tab=published", {
          alert: {
            type: "info",
            message: `${
              selected.length > 1 ? selected.length : selected[0].name
            } dashboard${selected.length > 1 ? "s" : ""} ${
              selected.length > 1 ? "were" : "was"
            } successfully archived`,
          },
        });

        await reloadDashboards();
      }
    }
  };

  let activeTab = "drafts";
  const validTabs = ["drafts", "pending", "published", "archived"];

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
          <PublishedTab
            dashboards={publishedDashboards}
            onArchive={onArchivePublishedDashboards}
          />
        </div>
        <div id="archived" label={`Archived (${archivedDashboards.length})`}>
          <ArchivedTab dashboards={archivedDashboards} />
        </div>
      </Tabs>
    </AdminLayout>
  );
}

export default DashboardListing;
