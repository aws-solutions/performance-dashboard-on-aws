import React from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCopy } from "@fortawesome/free-solid-svg-icons";
import { useDashboard, useDashboardVersions } from "../hooks";
import { DashboardState, LocationState } from "../models";
import BadgerService from "../services/BadgerService";
import AdminLayout from "../layouts/Admin";
import WidgetRender from "../components/WidgetRender";
import Button from "../components/Button";
import Alert from "../components/Alert";

interface PathParams {
  dashboardId: string;
}

function ViewDashboardAdmin() {
  const history = useHistory<LocationState>();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard } = useDashboard(dashboardId);
  const { versions } = useDashboardVersions(dashboard?.parentDashboardId);

  const currentDraft = versions.find(
    (v) =>
      v.state === DashboardState.Draft ||
      v.state === DashboardState.PublishPending
  );

  const onUpdate = async () => {
    if (
      window.confirm(
        "This will create a new draft of the dashboard that will allow " +
          "you to edit the content. The current version will remain " +
          "published until you publish the updates."
      )
    ) {
      try {
        const draft = await BadgerService.createDraft(dashboardId);
        history.push("/admin/dashboard/edit/".concat(draft.id), {
          alert: {
            type: "success",
            message: `A new draft version of "${draft.name}" dashboard has been created`,
          },
        });
      } catch (err) {
        console.log("Failed to create draft", err);
      }
    }
  };

  const onArchive = async () => {
    if (!dashboard) {
      return;
    }

    if (
      window.confirm(
        `This will remove "${dashboard.name}" dashboard from the external site. You can re-publish archived dashboards at any time.`
      )
    ) {
      await BadgerService.archive(dashboard.id, dashboard.updatedAt);

      history.push("/admin/dashboards?tab=archived", {
        alert: {
          type: "success",
          message: `${dashboard.name} was successfully archived`,
        },
      });
    }
  };

  return (
    <AdminLayout>
      <div className="position-sticky top-0 bg-white z-index-on-top">
        <Link to="/admin/dashboards?tab=published">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to dashboards
        </Link>
        {currentDraft && (
          <Alert
            type="info"
            message={
              <div>
                <FontAwesomeIcon icon={faCopy} className="margin-right-2" />A
                draft has been created to update this dashboard. Only one draft
                at a time is allowed.
                <Link
                  to={`/admin/dashboard/${
                    currentDraft.state === DashboardState.Draft
                      ? "edit/" + currentDraft.id
                      : currentDraft.id + "/publish"
                  }`}
                  className="float-right"
                >
                  {`${
                    currentDraft.state === DashboardState.Draft
                      ? "Edit"
                      : "Publish"
                  } draft`}
                </Link>
              </div>
            }
            hideIcon
            slim
          />
        )}
        <div className="grid-row margin-top-2">
          <div className="grid-col text-left">
            <div className="margin-top-2">
              <span className="usa-tag text-middle">
                Version {dashboard?.version}
              </span>
            </div>
          </div>
          <div className="grid-col text-right">
            <Button variant="outline" type="button" onClick={onArchive}>
              Archive
            </Button>
            <Button variant="base" onClick={onUpdate} disabled={!!currentDraft}>
              Update
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
