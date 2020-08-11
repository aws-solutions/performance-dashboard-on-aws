import React from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { useDashboard } from "../hooks";
import AdminLayout from "../layouts/Admin";
import Breadcrumbs from "../components/Breadcrumbs";
import EmptyContentBox from "../components/EmptyContentBox";
import ReactMarkdown from "react-markdown";

function EditDashboard() {
  const history = useHistory();
  const { dashboardId } = useParams();
  const { dashboard } = useDashboard(dashboardId);

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
        <div className="grid-col text-middle">
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
          <button className="usa-button" onClick={() => onSubmit()}>
            Save draft
          </button>
          <button
            className="usa-button usa-button--base"
            onClick={() => onCancel()}
          >
            Publish
          </button>
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
      <EmptyContentBox />
    </AdminLayout>
  );
}

export default EditDashboard;
