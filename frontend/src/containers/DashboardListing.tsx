import React, { useState } from "react";
import { useDashboards } from "../hooks";
import { LocationState } from "../models";
import Tabs from "../components/Tabs";
import DraftsTab from "../components/DraftsTab";
import PublishedTab from "../components/PublishedTab";
import PublishQueueTab from "../components/PublishQueueTab";
import ArchivedTab from "../components/ArchivedTab";
import { useLocation, useHistory } from "react-router-dom";
import AlertContainer from "../containers/AlertContainer";
import { Dashboard } from "../models";
import BackendService from "../services/BackendService";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";

function DashboardListing() {
  const { search } = useLocation();
  const history = useHistory<LocationState>();
  const {
    draftsDashboards,
    publishedDashboards,
    pendingDashboards,
    archivedDashboards,
    reloadDashboards,
    loading,
  } = useDashboards();

  const [isOpenArchiveModal, setIsOpenArchiveModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedDashboards, setSelectedDashboards] = useState<
    Array<Dashboard>
  >([]);

  const closeArchiveModal = () => {
    setIsOpenArchiveModal(false);
  };

  const closeDeleteModal = () => {
    setIsOpenDeleteModal(false);
  };

  const onArchiveDashboards = (selected: Array<Dashboard>) => {
    setSelectedDashboards(selected);
    setIsOpenArchiveModal(true);
  };

  const onDeleteDashboards = (selected: Array<Dashboard>) => {
    setSelectedDashboards(selected);
    setIsOpenDeleteModal(true);
  };

  const archiveDashboards = async () => {
    closeArchiveModal();

    if (selectedDashboards.length) {
      for (const dashboard of selectedDashboards) {
        await BackendService.archive(dashboard.id, dashboard.updatedAt);
      }

      history.replace("/admin/dashboards?tab=archived", {
        alert: {
          type: "success",
          message: `${
            selectedDashboards.length > 1
              ? selectedDashboards.length
              : selectedDashboards[0].name
          } dashboard${selectedDashboards.length > 1 ? "s" : ""} ${
            selectedDashboards.length > 1 ? "were" : "was"
          } successfully archived.`,
        },
      });

      await reloadDashboards();
    }
  };

  const deleteDashboards = async () => {
    closeDeleteModal();

    if (selectedDashboards.length) {
      await BackendService.deleteDashboards(
        selectedDashboards.map((dashboard) => dashboard.id)
      );

      history.replace("/admin/dashboards", {
        alert: {
          type: "success",
          message: `${
            selectedDashboards.length > 1
              ? selectedDashboards.length
              : selectedDashboards[0].name
          } draft dashboard${selectedDashboards.length > 1 ? "s" : ""} ${
            selectedDashboards.length > 1 ? "were" : "was"
          } successfully deleted.`,
        },
      });

      await reloadDashboards();
    }
  };

  let activeTab = "drafts";
  const validTabs = ["drafts", "pending", "published", "archived"];

  const queryString = search.split("tab=");
  if (queryString.length > 1 && validTabs.includes(queryString[1])) {
    activeTab = queryString[1];
  }

  const dashboardLabel = `${
    selectedDashboards.length !== 1
      ? `${selectedDashboards.length} selected`
      : `"${selectedDashboards[0].name}"`
  } dashboard${selectedDashboards.length !== 1 ? "s" : ""}`;

  return (
    <>
      <h1>Dashboards</h1>
      <Modal
        isOpen={isOpenArchiveModal}
        closeModal={closeArchiveModal}
        title={`Archive ${dashboardLabel}`}
        message={`This will remove ${
          selectedDashboards.length !== 1
            ? "these published dashboards"
            : "this published dashboard"
        } from the published site. You can re-publish archived dashboards at any time.`}
        buttonType="Archive"
        buttonAction={archiveDashboards}
      />

      <Modal
        isOpen={isOpenDeleteModal}
        closeModal={closeDeleteModal}
        title={`Delete ${dashboardLabel}`}
        message={`This will permanently delete ${
          selectedDashboards.length !== 1
            ? "these draft dashboards"
            : "this draft dashboard"
        }. This action cannot be undone. Are you sure you want to continue?`}
        buttonType="Delete"
        buttonAction={deleteDashboards}
      />

      {loading ? (
        <Spinner className="text-center margin-top-9" label="Loading" />
      ) : (
        <>
          <AlertContainer />
          <Tabs defaultActive={activeTab}>
            <div id="drafts" label={`Drafts (${draftsDashboards.length})`}>
              <DraftsTab
                dashboards={draftsDashboards}
                onDelete={onDeleteDashboards}
              />
            </div>
            <div
              id="pending"
              label={`Publish queue (${pendingDashboards.length})`}
            >
              <PublishQueueTab dashboards={pendingDashboards} />
            </div>
            <div
              id="published"
              label={`Published (${publishedDashboards.length})`}
            >
              <PublishedTab
                dashboards={publishedDashboards}
                onArchive={onArchiveDashboards}
              />
            </div>
            <div
              id="archived"
              label={`Archived (${archivedDashboards.length})`}
            >
              <ArchivedTab dashboards={archivedDashboards} />
            </div>
          </Tabs>
        </>
      )}
    </>
  );
}

export default DashboardListing;
