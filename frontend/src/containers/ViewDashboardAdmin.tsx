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
import Navigation from "../components/Navigation";
import { Waypoint } from "react-waypoint";
import Dropdown from "../components/Dropdown";

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
  const [activeWidgetId, setActiveWidgetId] = useState("");
  const windowSize = useWindowSize();

  const { t } = useTranslation();

  const mobilePreviewWidth = 400;
  const maxMobileViewportWidth = 450;
  const moveNavBarWidth = 1024;
  const isMobile = windowSize.width <= 600;

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
          message: `${t("NewDraftDashboardCreated.part1")}${draft.name}${t(
            "NewDraftDashboardCreated.part2"
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

  const handleVersionChange = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const version = versions.find((v) => String(v.version) === target.value);
    if (version) {
      history.push(`/admin/dashboard/${version.id}`);
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

  if (loading || !dashboard || !versions || !versions.length) {
    return (
      <Spinner
        className="text-center margin-top-9"
        label={t("LoadingSpinnerLabel")}
      />
    );
  }

  const draftOrPublishPending = versions.find(
    (v) =>
      v.state === DashboardState.Draft ||
      v.state === DashboardState.PublishPending
  );

  const statusAndVersion = (
    <ul
      className={`usa-button-group${
        dashboard.state === DashboardState.Draft ||
        dashboard.state === DashboardState.PublishPending
          ? " display-inline"
          : ""
      }`}
    >
      <li
        className={`usa-button-group__item${
          dashboard.state === DashboardState.Draft ||
          dashboard.state === DashboardState.PublishPending
            ? " display-inline"
            : ""
        }`}
      >
        <span className="usa-tag text-middle" style={{ cursor: "text" }}>
          {t(dashboard?.state)}
        </span>
      </li>
      <li
        className={`usa-button-group__item${
          dashboard.state === DashboardState.Draft ||
          dashboard.state === DashboardState.PublishPending
            ? " display-inline"
            : ""
        }`}
      >
        <span className="text-middle" style={{ cursor: "default" }}>
          {(dashboard.state === DashboardState.Draft ||
            dashboard.state === DashboardState.PublishPending) && (
            <FontAwesomeIcon icon={faCopy} className="margin-right-1" />
          )}
          {(dashboard.state === DashboardState.Draft ||
            dashboard.state === DashboardState.PublishPending) &&
            t("ViewDashboardAlertVersion")}{" "}
          {(dashboard.state === DashboardState.Draft ||
            dashboard.state === DashboardState.PublishPending) &&
            dashboard?.version}
          {(dashboard.state === DashboardState.Published ||
            dashboard.state === DashboardState.Archived ||
            dashboard.state === DashboardState.Inactive) && (
            <Dropdown
              id="version"
              name="version"
              label=""
              options={versions
                .filter(
                  (version) =>
                    version.state !== DashboardState.Draft &&
                    version.state !== DashboardState.PublishPending
                )
                .map((v) => {
                  return {
                    value: `${v.version}`,
                    label: `${t("ViewDashboardAlertVersion")} ${v.version}${
                      v.state === DashboardState.Published
                        ? ` (${t("Current")}) `
                        : ""
                    }`,
                  };
                })}
              value={`${dashboard.version}`}
              className={isMobile ? "margin-top-0" : "margin-top-neg-2"}
              onChange={handleVersionChange}
            />
          )}
        </span>
      </li>
      <li
        className={`usa-button-group__item${
          dashboard.state === DashboardState.Draft ||
          dashboard.state === DashboardState.PublishPending
            ? " display-inline"
            : ""
        }`}
      >
        {(dashboard.state === DashboardState.Published ||
          dashboard.state === DashboardState.Inactive ||
          dashboard.state === DashboardState.Archived) && (
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
  );

  const buttons = (
    <>
      {dashboard.state === DashboardState.Published && (
        <>
          {isMobile && (
            <div className="grid-row margin-top-2">
              <div className="grid-col-6 padding-right-05">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsOpenArchiveModal(true)}
                >
                  {t("ViewDashboardAlertButton.Archive")}
                </Button>
              </div>
              <div className="grid-col-6 padding-left-05">
                <Button
                  variant="base"
                  onClick={() => setIsOpenUpdateModal(true)}
                  disabled={!!draftOrPublishPending}
                >
                  {t("ViewDashboardAlertButton.Update")}
                </Button>
              </div>
            </div>
          )}
          {!isMobile && (
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
        </>
      )}

      {dashboard.state === DashboardState.Archived && (
        <>
          {isMobile && (
            <div className="grid-row margin-top-2">
              <div className="grid-col-6 padding-right-05">
                <Button
                  variant="outline"
                  type="button"
                  onClick={onDashboardHistory}
                >
                  {t("ViewHistoryLink")}
                </Button>
              </div>
              <div className="grid-col-6 padding-left-05">
                <Button
                  variant="base"
                  type="button"
                  onClick={() => setIsOpenRepublishModal(true)}
                >
                  {t("ViewDashboardAlertButton.Re-publish")}
                </Button>
              </div>
            </div>
          )}
          {!isMobile && (
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
          {isMobile && (
            <div className="grid-row margin-top-2">
              <div className="grid-col-6 padding-right-05">
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClosePreview}
                >
                  {t("ViewDashboardAlertButton.ClosePreview")}
                </Button>
              </div>
              <div className="grid-col-6 padding-left-05">
                {dashboard.state === DashboardState.Draft && (
                  <Button
                    variant="base"
                    onClick={() => setIsOpenPublishModal(true)}
                  >
                    {t("ViewDashboardAlertButton.Publish")}
                  </Button>
                )}
              </div>
            </div>
          )}
          {!isMobile && (
            <>
              <Button variant="outline" type="button" onClick={onClosePreview}>
                {t("ViewDashboardAlertButton.ClosePreview")}
              </Button>
              {dashboard.state === DashboardState.Draft && (
                <Button
                  variant="base"
                  onClick={() => setIsOpenPublishModal(true)}
                >
                  {t("ViewDashboardAlertButton.Publish")}
                </Button>
              )}
            </>
          )}
        </>
      )}
    </>
  );
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
        title={`${t("CreateDraftDashboardModalTitle.part1")}${
          dashboard?.name
        }${t("CreateDraftDashboardModalTitle.part2")}`}
        message={t("CreateDraftDashboardModalMessage")}
        buttonType={t("CreateDraftDashboardModalButton")}
        buttonAction={onUpdateDashboard}
      />

      <Modal
        isOpen={isOpenArchiveModal}
        closeModal={() => setIsOpenArchiveModal(false)}
        title={`${t("ArchiveDashboardModalTitle.part1")}${dashboard?.name}${t(
          "ArchiveDashboardModalTitle.part2"
        )}`}
        message={`${t("ArchiveDashboardModalMessage.part1")}${
          dashboard?.name
        }${t("ArchiveDashboardModalMessage.part2")}`}
        buttonType={t("ArchiveDashboardModalButton")}
        buttonAction={onArchiveDashboard}
      />

      <Modal
        isOpen={isOpenRepublishModal}
        closeModal={() => setIsOpenRepublishModal(false)}
        title={`${t("RepublishDashboardModalTitle.part1")}${dashboard?.name}${t(
          "RepublishDashboardModalTitle.part2"
        )}`}
        message={t("RepublishDashboardModalMessage")}
        buttonType={t("RepublishDashboardModalButton")}
        buttonAction={onRepublishDashboard}
      />

      <Modal
        isOpen={isOpenPublishModal}
        closeModal={() => setIsOpenPublishModal(false)}
        title={`${t("PreparePublishingModalTitle.part1")}${dashboard?.name}${t(
          "PreparePublishingModalTitle.part2"
        )}`}
        message={`${
          dashboard?.widgets.length === 0
            ? `${t("PreparePublishingModalMessage.part1")}`
            : ""
        }${t("PreparePublishingModalMessage.part2")}`}
        buttonType={t("PreparePublishingModalButton")}
        buttonAction={onPublishDashboard}
      />
      <PrimaryActionBar stickyPosition={75}>
        {(dashboard.state === DashboardState.Published ||
          dashboard.state === DashboardState.Inactive) &&
          draftOrPublishPending && (
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

        {isMobile && (
          <>
            <div
              className={`margin-top-${
                (dashboard.state === DashboardState.Published ||
                  dashboard.state === DashboardState.Inactive) &&
                !draftOrPublishPending
                  ? "0"
                  : "2"
              }`}
            >
              {statusAndVersion}
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
            <div className="grid-col text-right">{buttons}</div>
          </>
        )}
        {!isMobile && (
          <>
            <div
              className={`grid-row margin-top-${
                (dashboard.state === DashboardState.Published ||
                  dashboard.state === DashboardState.Inactive) &&
                !draftOrPublishPending
                  ? "0"
                  : "2"
              }`}
            >
              <div className="grid-col text-left flex-row flex-align-center display-flex">
                {statusAndVersion}
              </div>
              <div className="grid-col text-right">{buttons}</div>
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
          </>
        )}
      </PrimaryActionBar>

      <div
        style={
          showMobilePreview
            ? {
                maxWidth: `${mobilePreviewWidth}px`,
              }
            : {}
        }
        className={showMobilePreview ? "grid-container" : ""}
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
            <Navigation
              stickyPosition={80}
              offset={240}
              area={2}
              marginRight={27}
              widgetNameIds={dashboard?.widgets
                .filter(
                  (w) =>
                    dashboard &&
                    dashboard.tableOfContents &&
                    dashboard.tableOfContents[w.id]
                )
                .map((widget) => {
                  return {
                    name: widget.name,
                    id: widget.id,
                    isInsideSection: !!widget.section,
                  };
                })}
              activeWidgetId={activeWidgetId}
              setActivewidgetId={setActiveWidgetId}
              isTop={showMobilePreview || windowSize.width <= moveNavBarWidth}
              displayTableOfContents={dashboard?.displayTableOfContents}
              onClick={setActiveWidgetId}
            />
            {dashboard?.widgets
              .filter((w) => !w.section)
              .map((widget, index) => {
                return (
                  <div key={index}>
                    <Waypoint
                      onEnter={() => {
                        setActiveWidgetId(widget.id);
                      }}
                      topOffset="240px"
                      bottomOffset={`${windowSize.height - 250}px`}
                      fireOnRapidScroll={false}
                    >
                      <div className="margin-top-6 usa-prose" id={widget.id}>
                        <WidgetRender
                          widget={widget}
                          showMobilePreview={showMobilePreview}
                          widgets={dashboard.widgets}
                          setActiveWidgetId={setActiveWidgetId}
                          topOffset="240px"
                          bottomOffset={`${windowSize.height - 250}px`}
                        />
                      </div>
                    </Waypoint>
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
