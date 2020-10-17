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

interface PathParams {
  dashboardId: string;
}

function ViewDashboardAdmin() {
  const history = useHistory<LocationState>();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard } = useDashboard(dashboardId);

  const onUpdate = async () => {
    if (
      window.confirm(
        "This will create a new draft of the dashboard that will allow " +
          "you to edit the content. The current version will remain " +
          "published until you publish the updates."
      )
    ) {
      try {
        await BadgerService.createDraft(dashboardId);
        history.push("/admin/dashboards", {
          alert: {
            type: "success",
            message: `A new draft version of "${dashboard?.name}" dashboard has been created`,
          },
        });
      } catch (err) {
        console.log("Failed to create draft", err);
      }
    }
  };

  const onArchive = () => {
    console.log("Archive");
  };

  return (
    <AdminLayout>
      <div className="position-sticky top-0 bg-white z-index-on-top">
        <div className="grid-row margin-top-2">
          <div className="grid-col text-left">
            <Link to="/admin/dashboards?tab=published">
              <FontAwesomeIcon icon={faArrowLeft} /> Back to dashboards
            </Link>
            <div className="margin-top-2">
              <span className="usa-tag text-middle">
                Version {dashboard?.version}
              </span>
            </div>
          </div>
          <div className="grid-col text-right">
            <Button variant="base" onClick={onUpdate}>
              Update
            </Button>
            <Button variant="outline" type="button" onClick={onArchive}>
              Archive
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

export default ViewDashboardAdmin;
