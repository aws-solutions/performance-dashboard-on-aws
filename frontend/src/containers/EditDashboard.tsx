import React from "react";
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

function EditDashboard() {
  const history = useHistory();
  const { dashboardId } = useParams();
  const { dashboard, reloadDashboard } = useDashboard(dashboardId);

  const onAddContent = async () => {
    history.push(`/admin/dashboard/${dashboardId}/add-content`);
  };

  const onSubmit = async () => {
    history.push("/admin/dashboards");
  };

  const onCancel = () => {
    history.push("/admin/dashboards");
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

  const sortWidgetsByOrder = (widgets: Array<Widget>): Array<Widget> => {
    return [...widgets].sort((a, b) => {
      return a.order > b.order ? -1 : 1;
    });
  };

  const onMoveWidgetUp = async (widget: Widget) => {
    setWidgetOrder(widget, widget.order + 1);
  };

  const onMoveWidgetDown = async (widget: Widget) => {
    setWidgetOrder(widget, widget.order - 1);
  };

  const setWidgetOrder = async (widgetToMove: Widget, newPosition: number) => {
    if (dashboard) {
      const widgets = WidgetOrderingService.moveAndReOrder(
        dashboard.widgets,
        widgetToMove,
        newPosition
      );

      // Only do the API call if ordering changed
      if (widgets !== dashboard.widgets) {
        await BadgerService.setWidgetOrder(dashboardId, widgets);
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
              <span className="usa-tag">DRAFT</span>
            </li>
            <li className="usa-button-group__item">
              <a className="usa-link" href="/">
                Share draft URL
              </a>
            </li>
            <li className="usa-button-group__item">
              <a className="usa-link" href="/">
                Preview
              </a>
            </li>
          </ul>
        </div>
        <div className="grid-col text-right">
          <Button onClick={() => onSubmit()}>Save draft</Button>
          <Button variant="base" onClick={() => onCancel()}>
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
      <div className="text-base">{dashboard?.topicAreaName}</div>
      <div>
        {dashboard?.description ? (
          <ReactMarkdown source={dashboard.description} />
        ) : (
          <p>No description entered</p>
        )}
      </div>
      <hr />
      <WidgetList
        widgets={dashboard ? sortWidgetsByOrder(dashboard.widgets) : []}
        onClick={onAddContent}
        onDelete={onDeleteWidget}
        onMoveUp={onMoveWidgetUp}
        onMoveDown={onMoveWidgetDown}
      />
    </AdminLayout>
  );
}

export default EditDashboard;
