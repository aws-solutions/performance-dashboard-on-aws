import React, { useState } from "react";
import dayjs from "dayjs";
import { useHistory, useParams } from "react-router-dom";
import Link from "../components/Link";
import { useDashboard, useDashboardVersions } from "../hooks";
import { Widget, LocationState, WidgetType, DashboardState } from "../models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import BackendService from "../services/BackendService";
import WidgetOrderingService from "../services/WidgetOrdering";
import Breadcrumbs from "../components/Breadcrumbs";
import WidgetList from "../components/WidgetList";
import MarkdownRender from "../components/MarkdownRender";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import Tooltip from "../components/Tooltip";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import UtilsService from "../services/UtilsService";
import AlertContainer from "../containers/AlertContainer";

interface PathParams {
  dashboardId: string;
}

function EditDashboard() {
  const history = useHistory<LocationState>();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, reloadDashboard, setDashboard, loading } = useDashboard(
    dashboardId
  );
  const [isOpenPublishModal, setIsOpenPublishModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [widgetToDelete, setWidgetToDelete] = useState<Widget | undefined>(
    undefined
  );
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
    history.push(`/admin/dashboard/${dashboardId}/preview`);
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
          message: `"${widgetToDelete.name}" ${
            widgetToDelete.widgetType === WidgetType.Chart
              ? UtilsService.getChartTypeLabel(
                  widgetToDelete.content.chartType
                ).toLowerCase()
              : widgetToDelete.widgetType.toLowerCase()
          } was successfully deleted`,
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
      const widgets = WidgetOrderingService.moveWidget(
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
            label: "Dashboards",
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
        title={`Prepare "${dashboard?.name}" dashboard for publishing`}
        message={`${
          dashboard?.widgets.length === 0
            ? "This dashboard has no content items. "
            : ""
        }Are you sure you want to prepare this dashboard for publishing?`}
        buttonType="Prepare for publishing"
        buttonAction={publishDashboard}
      />

      <Modal
        isOpen={isOpenDeleteModal}
        closeModal={closeDeleteModal}
        title={
          widgetToDelete
            ? `Delete ${widgetToDelete.widgetType.toLowerCase()} content item: "${
                widgetToDelete.name
              }"`
            : ""
        }
        message="Deleting this content item cannot be undone. Are you sure you want to
                continue?"
        buttonType="Delete"
        buttonAction={deleteWidget}
      />

      {loading ? (
        <Spinner className="text-center margin-top-9" label="Loading" />
      ) : (
        <>
          <AlertContainer id="top-alert" />
          <div className="grid-row">
            <div className="grid-col text-left">
              <ul className="usa-button-group">
                <li className="usa-button-group__item">
                  <span className="usa-tag" style={{ cursor: "text" }}>
                    {dashboard?.state}
                  </span>
                </li>
                <li
                  className={`usa-button-group__item${
                    publishedOrArchived ? "" : " cursor-default"
                  }`}
                >
                  <span
                    className="text-underline"
                    data-for="version"
                    data-tip=""
                    data-event="click"
                    data-border={true}
                  >
                    <FontAwesomeIcon icon={faCopy} className="margin-right-1" />
                    Version {dashboard?.version}
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
                            A version of this dashboard is
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
                            View {publishedOrArchived.state.toLowerCase()}{" "}
                            version
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
            <div className="grid-col text-right">
              <span className="text-base margin-right-1">
                {dashboard &&
                  `Last saved ${dayjs(dashboard.updatedAt).fromNow()}`}
              </span>
              <Button variant="outline" onClick={onPreview}>
                Preview
              </Button>
              <span data-for="publish" data-tip="">
                <Button variant="base" onClick={onPublishDashboard}>
                  Publish
                </Button>
              </span>
              <Tooltip
                id="publish"
                place="bottom"
                effect="solid"
                offset={{ bottom: 8 }}
                getContent={() => (
                  <div className="font-sans-sm">
                    Prepare dashboard for publishing
                  </div>
                )}
              />
            </div>
          </div>
          <div>
            <h1 className="margin-bottom-0 display-inline-block">
              {dashboard?.name}
            </h1>
            <Link to={`/admin/dashboard/edit/${dashboard?.id}/details`}>
              <span className="margin-left-2">Edit details</span>
            </Link>
          </div>
          <div className="text-base text-italic">
            {dashboard?.topicAreaName}
          </div>
          <div>
            {dashboard?.description ? (
              <MarkdownRender source={dashboard.description} />
            ) : (
              <p>No description entered</p>
            )}
          </div>
          <hr />
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
