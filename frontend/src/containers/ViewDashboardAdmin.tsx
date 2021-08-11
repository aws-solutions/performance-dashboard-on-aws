import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Link from "../components/Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { useDashboard, useDashboardVersions, useWindowSize } from "../hooks";
import { Dashboard, DashboardState, LocationState } from "../models";
import BackendService from "../services/BackendService";
import WidgetRender from "../components/WidgetRender";
import Button from "../components/Button";
import Alert from "../components/Alert";
import Breadcrumbs from "../components/Breadcrumbs";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import DashboardHeader from "../components/DashboardHeader";
import UtilsService from "../services/UtilsService";
import PrimaryActionBar from "../components/PrimaryActionBar";
import "./ViewDashboardAdmin.css";

interface PathParams {
  dashboardId: string;
}

function ViewDashboardAdmin() {
  const history = useHistory<LocationState>();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { versions } = useDashboardVersions(dashboard?.parentDashboardId);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [isOpenArchiveModal, setIsOpenArchiveModal] = useState(false);
  const [isOpenRepublishModal, setIsOpenRepublishModal] = useState(false);
  const [isOpenPublishModal, setIsOpenPublishModal] = useState(false);
  const [showVersionNotes, setShowVersionNotes] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const windowSize = useWindowSize();

  const { t } = useTranslation();

  const mobilePreviewWidth = 400;
  const maxMobileViewportWidth = 450;

  const draftOrPublishPending = versions.find(
    (v) =>
      v.state === DashboardState.Draft ||
      v.state === DashboardState.PublishPending
  );

  const onClosePreview = () => {
    history.push(UtilsService.getDashboardUrlPath(dashboard));
  };

  const onPublishDashboard = async () => {
    setIsOpenPublishModal(false);
    if (dashboard) {
      await BackendService.publishPending(dashboard.id, dashboard.updatedAt);
      history.push(`/admin/dashboard/${dashboard.id}/publish`);
    }
  };

  const onUpdateDashboard = async () => {
    setIsOpenUpdateModal(false);

    try {
      const draft = await BackendService.createDraft(dashboardId);

      history.push(`/admin/dashboard/edit/${draft.id}`, {
        alert: {
          type: "success",
          message: `${t("NewDraftDashboardCreatedPrefix")} ${draft.name} ${t(
            "NewDraftDashboardCreatedSuffix"
          )}`,
        },
        id: "top-alert",
      });
    } catch (err) {
      console.log("Failed to create draft", err);
    }
  };

  const onArchiveDashboard = async () => {
    setIsOpenArchiveModal(false);

    if (!dashboard) {
      return;
    }

    await BackendService.archive(dashboard.id, dashboard.updatedAt);

    history.push("/admin/dashboards?tab=archived", {
      alert: {
        type: "success",
        message: `${dashboard.name} ${t("DashboardWasArchived")}`,
      },
    });
  };

  const onDashboardHistory = () => {
    if (dashboard) {
      history.push(`/admin/dashboard/${dashboard.id}/history`);
    }
  };

  const onRepublishDashboard = async () => {
    setIsOpenRepublishModal(false);
    if (dashboard) {
      await BackendService.publishDashboard(
        dashboard.id,
        dashboard.updatedAt,
        dashboard.releaseNotes || ""
      );
      history.push(`/admin/dashboards?tab=published`, {
        alert: {
          type: "success",
          message: `${dashboard.name} ${t("DashboardWasRepublished")}`,
          to: `/${dashboardId}`,
          linkLabel: t("ViewPublishedDashboard"),
        },
      });
    }
  };

  const dashboardListUrl = (dashboard: Dashboard) => {
    switch (dashboard.state) {
      case DashboardState.Published:
        return "/admin/dashboards?tab=published";
      case DashboardState.Archived:
        return "/admin/dashboards?tab=archived";
      case DashboardState.PublishPending:
        return "/admin/dashboards?tab=pending";
      default:
        return "/admin/dashboards";
    }
  };

  if (!dashboard) {
    return (
      <Spinner
        className="text-center margin-top-9"
        label={t("LoadingSpinnerLabel")}
      />
    );
  }

  const isDraftOrPublishPending =
    dashboard.state === DashboardState.Draft ||
    dashboard.state === DashboardState.PublishPending;

  return (
    <>
      <Breadcrumbs
        crumbs={[
          {
            label: `${t("Dashboards")}`,
            url: dashboardListUrl(dashboard),
          },
          {
            label: dashboard.name,
          },
        ]}
      />

      <Modal
        isOpen={isOpenUpdateModal}
        closeModal={() => setIsOpenUpdateModal(false)}
        title={`${t("CreateDraftDashboardModalTitlePrefix")} ${
          dashboard?.name
        } ${t("CreateDraftDashboardModalTitleSuffix")}`}
        message={t("CreateDraftDashboardModalMessage")}
        buttonType={t("CreateDraftDashboardModalButton")}
        buttonAction={onUpdateDashboard}
      />

      <Modal
        isOpen={isOpenArchiveModal}
        closeModal={() => setIsOpenArchiveModal(false)}
        title={`${t("ArchiveDashboardModalTitlePrefix")} ${dashboard?.name} ${t(
          "ArchiveDashboardModalTitleSuffix"
        )}`}
        message={`${t("ArchiveDashboardModalMessagePrefix")} ${
          dashboard?.name
        } ${t("ArchiveDashboardModalMessageSuffix")}`}
        buttonType={t("ArchiveDashboardModalButton")}
        buttonAction={onArchiveDashboard}
      />

      <Modal
        isOpen={isOpenRepublishModal}
        closeModal={() => setIsOpenRepublishModal(false)}
        title={`${t("RepublishDashboardModalTitlePrefix")} ${
          dashboard?.name
        } ${t("RepublishDashboardModalTitleSuffix")}`}
        message={t("RepublishDashboardModalMessage")}
        buttonType={t("RepublishDashboardModalButton")}
        buttonAction={onRepublishDashboard}
      />

      <Modal
        isOpen={isOpenPublishModal}
        closeModal={() => setIsOpenPublishModal(false)}
        title={`${t("PreparePublishingModalTitlePrefix")} ${
          dashboard?.name
        } ${t("PreparePublishingModalTitleSuffix")}`}
        message={`${
          dashboard?.widgets.length === 0
            ? `${t("PreparePublishingModalMessage.part1")}`
            : ""
        }${t("PreparePublishingModalMessage.part2")}`}
        buttonType={t("PreparePublishingModalButton")}
        buttonAction={onPublishDashboard}
      />
      <PrimaryActionBar stickyPosition={75}>
        {dashboard.state === DashboardState.Published && draftOrPublishPending && (
          <Alert
            type="info"
            message={
              <div className="margin-left-2">
                <FontAwesomeIcon icon={faCopy} className="margin-right-2" />
                {t("OnlyOneDraftDashboardAtATime")}
                <div className="float-right margin-right-1">
                  <Link
                    to={`/admin/dashboard/${
                      draftOrPublishPending.state === DashboardState.Draft
                        ? "edit/" + draftOrPublishPending.id
                        : draftOrPublishPending.id + "/publish"
                    }`}
                  >
                    {`${
                      draftOrPublishPending.state === DashboardState.Draft
                        ? `${t("EditOrPublishDraft.Edit")}`
                        : `${t("EditOrPublishDraft.Publish")}`
                    } ${t("EditOrPublishDraft.Draft")}`}
                  </Link>
                </div>
              </div>
            }
            hideIcon
            slim
          />
        )}

        {(dashboard.state === DashboardState.Draft ||
          dashboard.state === DashboardState.PublishPending) && (
          <Alert
            type="info"
            message={t("DashboardPreviewPublishedMessage")}
            slim
          />
        )}

        {dashboard.state === DashboardState.Archived && (
          <Alert type="info" slim message={t("RepublishDashboardToView")} />
        )}
        <div
          className={`grid-row margin-top-${
            dashboard.state === DashboardState.Published &&
            !draftOrPublishPending
              ? "0"
              : "2"
          }`}
        >
          <div
            className={`${
              isDraftOrPublishPending ? "grid-col-3" : "grid-col"
            } text-left flex-row flex-align-center display-flex`}
          >
            <ul className="usa-button-group">
              <li className="usa-button-group__item">
                <span
                  className="usa-tag text-middle"
                  style={{ cursor: "text" }}
                >
                  {t(dashboard?.state)}
                </span>
              </li>
              <li className="usa-button-group__item">
                <span className="text-middle" style={{ cursor: "default" }}>
                  <FontAwesomeIcon icon={faCopy} className="margin-right-1" />
                  {t("ViewDashboardAlertVersion")} {dashboard?.version}
                </span>
              </li>
              <li>
                {dashboard.state === DashboardState.Published && (
                  <Button
                    variant="unstyled"
                    type="button"
                    className="margin-left-1 margin-top-1 text-base-dark hover:text-base-darker active:text-base-darkest"
                    onClick={() => setShowVersionNotes(!showVersionNotes)}
                  >
                    {`${
                      showVersionNotes
                        ? `${t("ViewDashboardAlertVersionNotes.Hide")}`
                        : `${t("ViewDashboardAlertVersionNotes.Show")}`
                    } ${t("ViewDashboardAlertVersionNotes.VersionNotes")}`}
                  </Button>
                )}
              </li>
            </ul>
          </div>
          <div
            className={`${
              isDraftOrPublishPending ? "grid-col-9" : "grid-col"
            } text-right`}
          >
            {dashboard.state === DashboardState.Published && (
              <>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsOpenArchiveModal(true)}
                >
                  {t("ViewDashboardAlertButton.Archive")}
                </Button>
                <Button
                  variant="base"
                  onClick={() => setIsOpenUpdateModal(true)}
                  disabled={!!draftOrPublishPending}
                >
                  {t("ViewDashboardAlertButton.Update")}
                </Button>
              </>
            )}

            {dashboard.state === DashboardState.Archived && (
              <>
                <Button
                  variant="outline"
                  type="button"
                  onClick={onDashboardHistory}
                >
                  {t("ViewHistoryLink")}
                </Button>
                <Button
                  variant="base"
                  type="button"
                  onClick={() => setIsOpenRepublishModal(true)}
                >
                  {t("ViewDashboardAlertButton.Re-publish")}
                </Button>
              </>
            )}

            {(dashboard.state === DashboardState.Draft ||
              dashboard.state === DashboardState.PublishPending) && (
              <>
                <span
                  className="usa-checkbox"
                  style={{ marginRight: "8px" }}
                  hidden={windowSize.width < maxMobileViewportWidth}
                >
                  <input
                    className="usa-checkbox__input"
                    id="display-mobile-view"
                    type="checkbox"
                    name="showMobileView"
                    defaultChecked={false}
                    onChange={() => {
                      setShowMobilePreview(!showMobilePreview);
                    }}
                  />
                  <label
                    className="usa-checkbox__label"
                    htmlFor="display-mobile-view"
                  >
                    {t("MobilePreview")}
                  </label>
                </span>
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClosePreview}
                >
                  {t("ViewDashboardAlertButton.ClosePreview")}
                </Button>
                <Button
                  variant="base"
                  onClick={() => setIsOpenPublishModal(true)}
                  disabled={dashboard.state === DashboardState.PublishPending}
                >
                  {t("ViewDashboardAlertButton.Publish")}
                </Button>
              </>
            )}
          </div>
        </div>
        {showVersionNotes && (
          <>
            <div className="margin-top-3 text-bold font-sans-sm">
              {t("ViewDashboardAlertVersionNotesFrom", {
                version: dashboard?.version,
              })}
              <span className="text-underline">{` ${dashboard?.publishedBy}`}</span>
            </div>
            <div className="margin-top-2 text-base">
              {dashboard?.releaseNotes}
            </div>
          </>
        )}
      </PrimaryActionBar>

      <div
        style={
          showMobilePreview
            ? {
                width: `${mobilePreviewWidth}px`,
                margin: "auto",
              }
            : {}
        }
      >
        {loading ? (
          <Spinner
            className="text-center margin-top-9"
            label={t("LoadingSpinnerLabel")}
          />
        ) : (
          <>
            <DashboardHeader
              name={dashboard?.name}
              topicAreaName={dashboard?.topicAreaName}
              description={dashboard?.description}
              lastUpdated={dashboard?.updatedAt}
            />
            <hr />
            {dashboard?.widgets.map((widget, index) => {
              return (
                <div className="margin-top-6 usa-prose" key={index}>
                  <WidgetRender
                    widget={widget}
                    showMobilePreview={showMobilePreview}
                  />
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}

export default ViewDashboardAdmin;
