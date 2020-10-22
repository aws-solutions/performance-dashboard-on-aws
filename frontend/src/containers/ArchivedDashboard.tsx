import React from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useDashboard } from "../hooks";
import { LocationState } from "../models";
import BadgerService from "../services/BadgerService";
import AdminLayout from "../layouts/Admin";
import WidgetRender from "../components/WidgetRender";
import Button from "../components/Button";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import Alert from "../components/Alert";

interface PathParams {
  dashboardId: string;
}

function ArchivedDashboard() {
  const history = useHistory<LocationState>();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard } = useDashboard(dashboardId);

  const onRepublish = async () => {
    if (window.confirm("Are you sure you want to re-publish this dashboard?")) {
      if (dashboard) {
        await BadgerService.publishDashboard(
          dashboard.id,
          dashboard.updatedAt,
          dashboard.releaseNotes || ""
        );
        history.push(`/admin/dashboards?tab=published`, {
          alert: {
            type: "success",
            message: `${dashboard.name} dashboard was successfully re-published`,
          },
        });
      }
    }
  };

  return (
    <AdminLayout>
      <div className="position-sticky top-0 bg-white z-index-on-top">
        <Link to="/admin/dashboards?tab=archived">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to dashboards
        </Link>
        <Alert
          type="info"
          slim
          message="This dashboard is archived. It is not viewable on the published site unless it is re-published"
        />
        <div className="grid-row margin-top-2">
          <div className="grid-col text-left">
            <ul className="usa-button-group">
              <li className="usa-button-group__item">
                <span className="usa-tag">{dashboard?.state}</span>
              </li>
              <li className="usa-button-group__item">
                <span className="text-underline">
                  <FontAwesomeIcon icon={faCopy} className="margin-right-1" />
                  Version {dashboard?.version}
                </span>
              </li>
            </ul>
          </div>
          <div className="grid-col text-right">
            <Button variant="base" type="button" onClick={onRepublish}>
              Re-publish
            </Button>
          </div>
        </div>
        <div className="margin-top-2 gradient height-4" />
      </div>
      <div className="margin-top-2">
        <h1 className="margin-bottom-1 display-inline-block font-sans-2xl">
          {dashboard?.name}
        </h1>
        <div className="text-base text-italic">{dashboard?.topicAreaName}</div>
      </div>
      <div className="margin-y-2">
        {dashboard?.description ? (
          <ReactMarkdown
            source={dashboard.description}
            className="font-sans-lg usa-prose"
          />
        ) : (
          <p>No description entered</p>
        )}
      </div>
      <hr />
      {dashboard?.widgets.map((widget, index) => {
        return (
          <div className="margin-top-5" key={index}>
            <WidgetRender widget={widget} />
          </div>
        );
      })}
    </AdminLayout>
  );
}

export default ArchivedDashboard;
