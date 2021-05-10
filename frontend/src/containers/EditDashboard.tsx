import React, { useState } from "react";
import dayjs from "dayjs";
import { useHistory, useParams } from "react-router-dom";
import Link from "../components/Link";
import { useDashboard, useDashboardVersions } from "../hooks";
import { Widget, LocationState, WidgetType, DashboardState } from "../models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import BackendService from "../services/BackendService";
import OrderingService from "../services/OrderingService";
import Breadcrumbs from "../components/Breadcrumbs";
import WidgetList from "../components/WidgetList";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import Tooltip from "../components/Tooltip";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import UtilsService from "../services/UtilsService";
import AlertContainer from "../containers/AlertContainer";
import DashboardHeader from "../components/DashboardHeader";
import PrimaryActionBar from "../components/PrimaryActionBar";
import { useTranslation } from "react-i18next";

interface PathParams {
  dashboardId: string;
}

function EditDashboard() {
  const { t } = useTranslation();
  const history = useHistory<LocationState>();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, reloadDashboard, setDashboard, loading } =
    useDashboard(dashboardId);
  const [isOpenPublishModal, setIsOpenPublishModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [widgetToDelete, setWidgetToDelete] =
    useState<Widget | undefined>(undefined);
  const { versions } = useDashboardVersions(dashboard?.parentDashboardId);

  const publishedOrArchived = versions.find(
    (v) =>
      v.state === DashboardState.Published ||
      v.state === DashboardState.Archived
  );

  const onAddContent = async () => {
    history.push(`/admin/dashboard/${dashboardId}/add-content`);
  };

  const onPreview = () => {
    history.push(`/admin/dashboard/${dashboardId}`);
  };

  const closePublishModal = () => {
    setIsOpenPublishModal(false);
  };

  const closeDeleteModal = () => {
    setIsOpenDeleteModal(false);
  };

  const onPublishDashboard = () => {
    setIsOpenPublishModal(true);
  };

  const onDeleteWidget = (widget: Widget) => {
    setWidgetToDelete(widget);
    setIsOpenDeleteModal(true);
  };

  const publishDashboard = async () => {
    closePublishModal();

    if (dashboard) {
      await BackendService.publishPending(dashboard.id, dashboard.updatedAt);

      history.push(`/admin/dashboard/${dashboard.id}/publish`);
    }
  };

  const deleteWidget = async () => {
    closeDeleteModal();

    if (dashboard && widgetToDelete) {
      await BackendService.deleteWidget(dashboardId, widgetToDelete.id);

      history.replace(`/admin/dashboard/edit/${dashboardId}`, {
        alert: {
          type: "success",
          message: `${t(
            widgetToDelete.widgetType === WidgetType.Chart
              ? widgetToDelete.content.chartType
              : widgetToDelete.widgetType
          )} '${widgetToDelete.name}' ${t("DashboardWasDeleted")}`,
        },
      });

      await reloadDashboard();
    }
  };

  const onMoveWidgetUp = async (index: number) => {
    return setWidgetOrder(index, index - 1);
  };

  const onMoveWidgetDown = async (index: number) => {
    return setWidgetOrder(index, index + 1);
  };

  const setWidgetOrder = async (index: number, newIndex: number) => {
    if (dashboard) {
      const widgets = OrderingService.moveWidget(
        dashboard.widgets,
        index,
        newIndex
      );

      // if no change in order ocurred, exit
      if (widgets === dashboard.widgets) {
        return;
      }

      try {
        setDashboard({ ...dashboard, widgets }); // optimistic ui
        await BackendService.setWidgetOrder(dashboardId, widgets);
      } finally {
        await reloadDashboard(false);
      }
    }
  };

  return (
    <>
      <Breadcrumbs
        crumbs={[
          {
            label: t("Dashboards"),
            url: "/admin/dashboards",
          },
          {
            label: dashboard?.name,
          },
        ]}
      />

      <Modal
        isOpen={isOpenPublishModal}
        closeModal={closePublishModal}
        title={t("PreparePublishingModalTitle", { name: dashboard?.name })}
        message={`${
          dashboard?.widgets.length === 0
            ? `${t("PreparePublishingModalMessage.part1")}`
            : ""
        }${t("PreparePublishingModalMessage.part2")}`}
        buttonType={t("PreparePublishingModalButton")}
        buttonAction={publishDashboard}
      />

      <Modal
        isOpen={isOpenDeleteModal}
        closeModal={closeDeleteModal}
        title={
          widgetToDelete
            ? `${t("Delete")} ${widgetToDelete.widgetType.toLowerCase()} ${t(
                "ContentItem"
              )}: "${widgetToDelete.name}"`
            : ""
        }
        message={t("DeletingContentItem")}
        buttonType={t("Delete")}
        buttonAction={deleteWidget}
      />

      {loading || !versions ? (
        <Spinner
          className="text-center margin-top-9"
          label={t("LoadingSpinnerLabel")}
        />
      ) : (
        <>
          <PrimaryActionBar className="grid-row" stickyPosition={75}>
            <div className="grid-col-4 text-left flex-row flex-align-center display-flex">
              <ul className="usa-button-group">
                <li className="usa-button-group__item">
                  <span className="usa-tag" style={{ cursor: "text" }}>
                    {t("Draft")}
                  </span>
                </li>
                <li
                  className={`usa-button-group__item${
                    publishedOrArchived ? "" : " cursor-default"
                  }`}
                >
                  <span
                    className={`${publishedOrArchived ? "text-underline" : ""}`}
                    data-for="version"
                    data-tip=""
                    data-event="click"
                    data-border={true}
                  >
                    <FontAwesomeIcon icon={faCopy} className="margin-right-1" />
                    {t("Version")} {dashboard?.version}
                  </span>
                  {publishedOrArchived && (
                    <Tooltip
                      id="version"
                      place="bottom"
                      type="light"
                      effect="solid"
                      offset={{ right: 14 }}
                      getContent={() => (
                        <div className="font-sans-sm">
                          <p className="margin-top-0">
                            {t("VersionDashboard")}
                            <br />
                            {publishedOrArchived.state.toLowerCase()}.
                          </p>
                          <Link
                            target="_blank"
                            to={`/admin/dashboard${
                              publishedOrArchived.state ===
                              DashboardState.Archived
                                ? "/archived"
                                : ""
                            }/${publishedOrArchived.id}`}
                          >
                            {t("ViewVersion", {
                              state: publishedOrArchived.state.toLowerCase(),
                            })}
                            <FontAwesomeIcon
                              className="margin-left-1"
                              icon={faExternalLinkAlt}
                              size="sm"
                            />
                          </Link>
                        </div>
                      )}
                      clickable
                    />
                  )}
                </li>
              </ul>
            </div>
            <div className="grid-col-8 text-right">
              <span className="text-base margin-right-1">
                {dashboard &&
                  `${t("LastSaved")} ${dayjs(dashboard.updatedAt)
                    .locale(window.navigator.language.toLowerCase())
                    .fromNow()}`}
              </span>
              <Button variant="outline" onClick={onPreview}>
                {t("PreviewButton")}
              </Button>
              <span data-for="publish" data-tip="">
                <Button variant="base" onClick={onPublishDashboard}>
                  {t("PublishButton")}
                </Button>
              </span>
              <Tooltip
                id="publish"
                place="bottom"
                effect="solid"
                offset={{ bottom: 8 }}
                getContent={() => (
                  <div className="font-sans-sm">
                    {t("PrepareDashboardForPublishing")}
                  </div>
                )}
              />
            </div>
          </PrimaryActionBar>
          <DashboardHeader
            name={dashboard?.name}
            topicAreaName={dashboard?.topicAreaName}
            description={dashboard?.description}
            unpublished
            link={
              <Link to={`/admin/dashboard/edit/${dashboard?.id}/details`}>
                <span className="margin-left-2">{t("EditDetails")}</span>
              </Link>
            }
          />
          <AlertContainer id="top-alert" />
          <WidgetList
            widgets={dashboard ? dashboard.widgets : []}
            onClick={onAddContent}
            onDelete={onDeleteWidget}
            onMoveUp={onMoveWidgetUp}
            onMoveDown={onMoveWidgetDown}
          />
        </>
      )}
    </>
  );
}

export default EditDashboard;
