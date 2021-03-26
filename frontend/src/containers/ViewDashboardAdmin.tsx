import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Link from "../components/Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { useDashboard, useDashboardVersions } from "../hooks";
import { Dashboard, DashboardState, LocationState } from "../models";
import BackendService from "../services/BackendService";
import WidgetRender from "../components/WidgetRender";
import Button from "../components/Button";
import Alert from "../components/Alert";
import Breadcrumbs from "../components/Breadcrumbs";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import DashboardHeader from "../components/DashboardHeader";
import UtilsService from "../services/UtilsService";
import "./ViewDashboardAdmin.css";
import PrimaryActionBar from "../components/PrimaryActionBar";

interface PathParams {
  dashboardId: string;
}

function ViewDashboardAdmin() {
  const history = useHistory<LocationState>();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { versions } = useDashboardVersions(dashboard?.parentDashboardId);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [isOpenArchiveModal, setIsOpenArchiveModal] = useState(false);
  const [isOpenRepublishModal, setIsOpenRepublishModal] = useState(false);
  const [isOpenPublishModal, setIsOpenPublishModal] = useState(false);
  const [showVersionNotes, setShowVersionNotes] = useState(false);

  const draftOrPublishPending = versions.find(
    (v) =>
      v.state === DashboardState.Draft ||
      v.state === DashboardState.PublishPending
  );

  const onClosePreview = () => {
    history.push(UtilsService.getDashboardUrlPath(dashboard));
  };

  const onPublishDashboard = async () => {
    setIsOpenPublishModal(false);
    if (dashboard) {
      await BackendService.publishPending(dashboard.id, dashboard.updatedAt);
      history.push(`/admin/dashboard/${dashboard.id}/publish`);
    }
  };

  const onUpdateDashboard = async () => {
    setIsOpenUpdateModal(false);

    try {
      const draft = await BackendService.createDraft(dashboardId);

      history.push(`/admin/dashboard/edit/${draft.id}`, {
        alert: {
          type: "success",
          message: `A new draft version of "${draft.name}" dashboard has been created.`,
        },
        id: "top-alert",
      });
    } catch (err) {
      console.log("Failed to create draft", err);
    }
  };

  const onArchiveDashboard = async () => {
    setIsOpenArchiveModal(false);

    if (!dashboard) {
      return;
    }

    await BackendService.archive(dashboard.id, dashboard.updatedAt);

    history.push("/admin/dashboards?tab=archived", {
      alert: {
        type: "success",
        message: `${dashboard.name} was successfully archived.`,
      },
    });
  };

  const onRepublishDashboard = async () => {
    setIsOpenRepublishModal(false);
    if (dashboard) {
      await BackendService.publishDashboard(
        dashboard.id,
        dashboard.updatedAt,
        dashboard.releaseNotes || ""
      );
      history.push(`/admin/dashboards?tab=published`, {
        alert: {
          type: "success",
          message: `${dashboard.name} dashboard was successfully re-published.`,
          to: `/${dashboardId}`,
          linkLabel: "View the published dashboard",
        },
      });
    }
  };

  const dashboardListUrl = (dashboard: Dashboard) => {
    switch (dashboard.state) {
      case DashboardState.Published:
        return "/admin/dashboards?tab=published";
      case DashboardState.Archived:
        return "/admin/dashboards?tab=archived";
      case DashboardState.PublishPending:
        return "/admin/dashboards?tab=pending";
      default:
        return "/admin/dashboards";
    }
  };

  if (!dashboard) {
    return <Spinner className="text-center margin-top-9" label="Loading" />;
  }

  return (
    <>
      <Breadcrumbs
        crumbs={[
          {
            label: "Dashboards",
            url: dashboardListUrl(dashboard),
          },
          {
            label: dashboard.name,
          },
        ]}
      />

      <Modal
        isOpen={isOpenUpdateModal}
        closeModal={() => setIsOpenUpdateModal(false)}
        title={`Update "${dashboard?.name}" dashboard`}
        message={
          "This will create a new draft of the dashboard that will allow you to edit the content," +
          " then publish the new version to the published site."
        }
        buttonType="Create draft"
        buttonAction={onUpdateDashboard}
      />

      <Modal
        isOpen={isOpenArchiveModal}
        closeModal={() => setIsOpenArchiveModal(false)}
        title={`Archive "${dashboard?.name}" dashboard`}
        message={`This will remove "${dashboard?.name}" dashboard from the published site. You can re-publish archived dashboards at any time.`}
        buttonType="Archive"
        buttonAction={onArchiveDashboard}
      />

      <Modal
        isOpen={isOpenRepublishModal}
        closeModal={() => setIsOpenRepublishModal(false)}
        title={`Re-publish "${dashboard?.name}" dashboard`}
        message="Are you sure you want to re-publish this dashboard?"
        buttonType="Re-publish"
        buttonAction={onRepublishDashboard}
      />

      <Modal
        isOpen={isOpenPublishModal}
        closeModal={() => setIsOpenPublishModal(false)}
        title={`Prepare "${dashboard?.name}" dashboard for publishing`}
        message={`${
          dashboard?.widgets.length === 0
            ? "This dashboard has no content items. "
            : ""
        }Are you sure you want to prepare this dashboard for publishing?`}
        buttonType="Prepare for publishing"
        buttonAction={onPublishDashboard}
      />
      <PrimaryActionBar stickyPosition={75}>
        {dashboard.state === DashboardState.Published && draftOrPublishPending && (
          <Alert
            type="info"
            message={
              <div>
                <FontAwesomeIcon icon={faCopy} className="margin-right-2" />A
                draft has been created to update this dashboard. Only one draft
                at a time is allowed.
                <div className="float-right">
                  <Link
                    to={`/admin/dashboard/${
                      draftOrPublishPending.state === DashboardState.Draft
                        ? "edit/" + draftOrPublishPending.id
                        : draftOrPublishPending.id + "/publish"
                    }`}
                  >
                    {`${
                      draftOrPublishPending.state === DashboardState.Draft
                        ? "Edit"
                        : "Publish"
                    } draft`}
                  </Link>
                </div>
              </div>
            }
            hideIcon
            slim
          />
        )}

        {(dashboard.state === DashboardState.Draft ||
          dashboard.state === DashboardState.PublishPending) && (
          <Alert
            type="info"
            message="Below is a preview of what the published dashboard will look like.
              If ready to proceed, you can publish the dashboard to make it
              available on the published site."
            slim
          />
        )}

        {dashboard.state === DashboardState.Archived && (
          <Alert
            type="info"
            slim
            message="This dashboard is archived. It is not viewable on the published site unless it is re-published"
          />
        )}
        <div className="grid-row margin-top-2">
          <div className="grid-col text-left flex-row flex-align-center display-flex">
            <ul className="usa-button-group">
              <li className="usa-button-group__item">
                <span
                  className="usa-tag text-middle"
                  style={{ cursor: "text" }}
                >
                  {dashboard?.state}
                </span>
              </li>
              <li className="usa-button-group__item">
                <span className="text-underline text-middle">
                  <FontAwesomeIcon icon={faCopy} className="margin-right-1" />
                  Version {dashboard?.version}
                </span>
              </li>
              <li>
                {dashboard.state === DashboardState.Published && (
                  <Button
                    variant="unstyled"
                    type="button"
                    className="margin-left-1 margin-top-1 text-base-dark hover:text-base-darker active:text-base-darkest"
                    onClick={() => setShowVersionNotes(!showVersionNotes)}
                  >
                    {`${showVersionNotes ? "Hide" : "Show"} version notes`}
                  </Button>
                )}
              </li>
            </ul>
          </div>
          <div className="grid-col text-right">
            {dashboard.state === DashboardState.Published && (
              <>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsOpenArchiveModal(true)}
                >
                  Archive
                </Button>
                <Button
                  variant="base"
                  onClick={() => setIsOpenUpdateModal(true)}
                  disabled={!!draftOrPublishPending}
                >
                  Update
                </Button>
              </>
            )}

            {dashboard.state === DashboardState.Archived && (
              <Button
                variant="base"
                type="button"
                onClick={() => setIsOpenRepublishModal(true)}
              >
                Re-publish
              </Button>
            )}

            {(dashboard.state === DashboardState.Draft ||
              dashboard.state === DashboardState.PublishPending) && (
              <>
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClosePreview}
                >
                  Close Preview
                </Button>
                <Button
                  variant="base"
                  onClick={() => setIsOpenPublishModal(true)}
                  disabled={dashboard.state === DashboardState.PublishPending}
                >
                  Publish
                </Button>
              </>
            )}
          </div>
        </div>
        {showVersionNotes && (
          <>
            <div className="margin-top-3 text-bold font-sans-sm">
              {`Version ${dashboard?.version} notes from `}
              <span className="text-underline">{dashboard?.publishedBy}</span>
            </div>
            <div className="margin-top-2 text-base">
              {dashboard?.releaseNotes}
            </div>
          </>
        )}
      </PrimaryActionBar>

      {loading ? (
        <Spinner className="text-center margin-top-9" label="Loading" />
      ) : (
        <>
          <DashboardHeader
            name={dashboard?.name}
            topicAreaName={dashboard?.topicAreaName}
            description={dashboard?.description}
            lastUpdated={dashboard?.updatedAt}
          />
          <hr />
          {dashboard?.widgets.map((widget, index) => {
            return (
              <div className="margin-top-6 usa-prose" key={index}>
                <WidgetRender widget={widget} />
              </div>
            );
          })}
        </>
      )}
    </>
  );
}

export default ViewDashboardAdmin;
