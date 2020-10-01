import React from "react";
import dayjs from "dayjs";
import { useHistory, useParams, Link } from "react-router-dom";
import { useDashboard } from "../hooks";
import { Widget } from "../models";
import BadgerService from "../services/BadgerService";
import WidgetOrderingService from "../services/WidgetOrdering";
import AdminLayout from "../layouts/Admin";
import Breadcrumbs from "../components/Breadcrumbs";
import WidgetList from "../components/WidgetList";
import ReactMarkdown from "react-markdown";
import Button from "../components/Button";

interface PathParams {
  dashboardId: string;
}

function EditDashboard() {
  const history = useHistory();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, reloadDashboard, setDashboard } = useDashboard(
    dashboardId
  );

  const onAddContent = async () => {
    history.push(`/admin/dashboard/${dashboardId}/add-content`);
  };

  const onPublish = async () => {
    if (
      window.confirm(
        "Are you sure you want to publish this dashboard? After publishing, the dashboard will be viewable on the external dashboard website."
      )
    ) {
      if (dashboard) {
        await BadgerService.publishDashboard(dashboard.id, dashboard.updatedAt);
        await reloadDashboard();
      }
    }
  };

  const onDeleteWidget = async (widget: Widget) => {
    if (
      window.confirm(
        `Deleting ${widget.widgetType} content "${widget.name}" cannot be undone. Are you sure you want to continue?`
      )
    ) {
      if (dashboard) {
        await BadgerService.deleteWidget(dashboardId, widget.id);
        await reloadDashboard();
      }
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
        await BadgerService.setWidgetOrder(dashboardId, widgets);
      } finally {
        await reloadDashboard();
      }
    }
  };

  return (
    <AdminLayout>
      <Breadcrumbs />
      <div className="grid-row">
        <div className="grid-col text-left">
          <ul className="usa-button-group">
            <li className="usa-button-group__item">
              <span className="usa-tag">{dashboard?.state}</span>
            </li>
            <li className="usa-button-group__item">
              <a className="usa-link" href="/">
                Share draft URL
              </a>
            </li>
            <li className="usa-button-group__item">
              <Link to={`/admin/dashboard/${dashboard?.id}/preview`}>
                Preview
              </Link>
            </li>
          </ul>
        </div>
        <div className="grid-col text-right">
          <span className="text-base margin-right-1">
            {dashboard && `Last saved ${dayjs(dashboard.updatedAt).fromNow()}`}
          </span>
          <Button variant="base" onClick={onPublish}>
            Publish
          </Button>
        </div>
      </div>
      <div>
        <h1 className="margin-bottom-0 display-inline-block">
          {dashboard?.name}
        </h1>
        <Link
          to={`/admin/dashboard/edit/${dashboard?.id}/details`}
          className="margin-left-2"
        >
          Edit details
        </Link>
      </div>
      <div className="text-base text-italic">{dashboard?.topicAreaName}</div>
      <div>
        {dashboard?.description ? (
          <ReactMarkdown source={dashboard.description} />
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
    </AdminLayout>
  );
}

export default EditDashboard;
