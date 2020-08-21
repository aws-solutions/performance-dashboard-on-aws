import React from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { useDashboard } from "../hooks";
import AdminLayout from "../layouts/Admin";
import Breadcrumbs from "../components/Breadcrumbs";
import WidgetList from "../components/WidgetList";
import ReactMarkdown from "react-markdown";
import Button from "../components/Button";
//import BadgerService from "../services/BadgerService";

function EditDashboard() {
  const history = useHistory();
  const { dashboardId } = useParams();
  const { dashboard, /*setDashboard*/ } = useDashboard(dashboardId);

  const onAddContent = async () => {
    /*await BadgerService.createWidget(
        dashboardId,
        "Correlation of COVID cases to deaths",
        "Text",
        {}
      );
    const data = await BadgerService.fetchDashboardById(dashboardId);
    setDashboard(data);*/
    history.push(`/admin/dashboard/${dashboardId}/add-content`);
  };

  const onSubmit = async () => {
    history.push("/admin/dashboards");
  };

  const onCancel = () => {
    history.push("/admin/dashboards");
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
          <Button variant="base" onClick={() => onCancel()}>Publish</Button>
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
      <WidgetList widgets={dashboard ? dashboard.widgets : []} onClick={onAddContent} />
    </AdminLayout>
  );
}

export default EditDashboard;
