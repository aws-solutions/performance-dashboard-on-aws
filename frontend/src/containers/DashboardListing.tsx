import React, { useState } from "react";
import { useDashboards, useWindowSize } from "../hooks";
import { Dashboard, LocationState } from "../models";
import Tabs from "../components/Tabs";
import DraftsTab from "../components/DraftsTab";
import PublishedTab from "../components/PublishedTab";
import ArchivedTab from "../components/ArchivedTab";
import { useLocation, useHistory } from "react-router-dom";
import AlertContainer from "../containers/AlertContainer";
import BackendService from "../services/BackendService";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import { useTranslation } from "react-i18next";

function DashboardListing() {
  const { t } = useTranslation();
  const { search } = useLocation();
  const history = useHistory<LocationState>();
  const windowSize = useWindowSize();
  const {
    draftsDashboards,
    publishedDashboards,
    archivedDashboards,
    reloadDashboards,
    loading,
  } = useDashboards();

  const [isOpenArchiveModal, setIsOpenArchiveModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenCopyModal, setIsOpenCopyModal] = useState(false);
  const [selectedDashboards, setSelectedDashboards] = useState<
    Array<Dashboard>
  >([]);

  const closeArchiveModal = () => {
    setIsOpenArchiveModal(false);
  };

  const closeDeleteModal = () => {
    setIsOpenDeleteModal(false);
  };

  const closeCopyModal = () => {
    setIsOpenCopyModal(false);
  };

  const onArchiveDashboards = (selected: Array<Dashboard>) => {
    setSelectedDashboards(selected);
    setIsOpenArchiveModal(true);
  };

  const onDeleteDashboards = (selected: Array<Dashboard>) => {
    setSelectedDashboards(selected);
    setIsOpenDeleteModal(true);
  };

  const onCopyDashboards = (selected: Array<Dashboard>) => {
    setSelectedDashboards(selected);
    setIsOpenCopyModal(true);
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
          } ${
            selectedDashboards.length > 1
              ? t("DashboardListing.DashboardPlural")
              : t("DashboardListing.DashboardSingular")
          } ${t("DashboardListing.SuccessfullyArchived")}`,
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
          } ${
            selectedDashboards.length > 1
              ? t("DashboardListing.DraftDashboardPlural")
              : t("DashboardListing.DraftDashboardSingular")
          } ${t("DashboardListing.SuccessfullyDeleted")}`,
        },
      });

      await reloadDashboards();
    }
  };

  const copyDashboards = async () => {
    closeCopyModal();

    if (selectedDashboards.length) {
      for (let dashboard of selectedDashboards) {
        await BackendService.copyDashboard(dashboard.id);
      }

      history.replace("/admin/dashboards", {
        alert: {
          type: "success",
          message: `${
            selectedDashboards.length > 1
              ? selectedDashboards.length
              : selectedDashboards[0].name
          } ${
            selectedDashboards.length > 1
              ? t("DashboardListing.DashboardPlural")
              : t("DashboardListing.DashboardSingular")
          } ${t("DashboardListing.SuccessfullyCopied")}`,
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
      ? `${selectedDashboards.length} ${t(
          "DashboardListing.SelectedDashboards"
        )}`
      : `"${selectedDashboards[0].name}" ${t("DashboardListing.Dashboard")}`
  }`;

  return (
    <>
      <AlertContainer />
      <h1>{t("DashboardListing.Dashboards")}</h1>
      <Modal
        isOpen={isOpenArchiveModal}
        closeModal={closeArchiveModal}
        title={`${t("DashboardListing.Archive")} ${dashboardLabel}`}
        message={`${t("DashboardListing.ThisWillRemove")} ${
          selectedDashboards.length !== 1
            ? t("DashboardListing.PublishedDashboardPlural")
            : t("DashboardListing.PublishedDashboardSingular")
        } ${t("DashboardListing.ArchivedModalMessage")}`}
        buttonType={t("DashboardListing.Archive")}
        buttonAction={archiveDashboards}
      />

      <Modal
        isOpen={isOpenDeleteModal}
        closeModal={closeDeleteModal}
        title={`${t("DashboardListing.Delete")} ${dashboardLabel}`}
        message={`${t("DashboardListing.ThisWillPermanentlyDelete")} ${
          selectedDashboards.length !== 1
            ? t("DashboardListing.TheseDraftDashboards")
            : t("DashboardListing.ThisDraftDashboard")
        }. ${t("DashboardListing.DeletedModalMessage")}`}
        buttonType={t("DashboardListing.Delete")}
        buttonAction={deleteDashboards}
      />

      <Modal
        isOpen={isOpenCopyModal}
        closeModal={closeCopyModal}
        title={`${t("DashboardListing.Copy")} ${dashboardLabel}?`}
        message={`${t("DashboardListing.CopyDashboard", {
          count: selectedDashboards.length,
        })}`}
        buttonType={t("DashboardListing.Copy")}
        buttonAction={copyDashboards}
      />

      {loading ? (
        <Spinner
          className="text-center margin-top-9"
          label={t("LoadingSpinnerLabel")}
        />
      ) : (
        <>
          <Tabs
            defaultActive={activeTab}
            showArrows={windowSize.width <= 600}
            ariaLabel={t("DashboardListing.Dashboard")}
          >
            <div
              id="drafts"
              label={`${t("DashboardListing.Drafts")} (${
                draftsDashboards.length
              })`}
            >
              <DraftsTab
                dashboards={draftsDashboards}
                onDelete={onDeleteDashboards}
                onCopy={onCopyDashboards}
              />
            </div>
            <div
              id="published"
              label={`${t("DashboardListing.Published")} (${
                publishedDashboards.length
              })`}
            >
              <PublishedTab
                dashboards={publishedDashboards}
                onArchive={onArchiveDashboards}
                onCopy={onCopyDashboards}
              />
            </div>
            <div
              id="archived"
              label={`${t("DashboardListing.Archived")} (${
                archivedDashboards.length
              })`}
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
