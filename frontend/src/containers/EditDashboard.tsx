import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDashboard } from "../hooks";
import AdminLayout from "../layouts/Admin";

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
      <h1 className="margin-bottom-0">{dashboard?.name}</h1>
      <span className="text-base">{dashboard?.topicAreaName}</span>
      <div className="padding-6 margin-top-3 margin-bottom-3 border border-dashed bg-base-lightest">
        This dashboard is empty
      </div>
      <button className="usa-button" onClick={() => onSubmit()}>
        Save & Close
      </button>
      <button
        className="usa-button usa-button--unstyled"
        onClick={() => onCancel()}
      >
        Cancel
      </button>
    </AdminLayout>
  );
}

export default EditDashboard;
