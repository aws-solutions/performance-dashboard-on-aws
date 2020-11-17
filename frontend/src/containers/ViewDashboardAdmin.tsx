import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Link from "../components/Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { useDashboard, useDashboardVersions } from "../hooks";
import { DashboardState, LocationState } from "../models";
import BackendService from "../services/BackendService";
import WidgetRender from "../components/WidgetRender";
import Button from "../components/Button";
import Alert from "../components/Alert";
import Breadcrumbs from "../components/Breadcrumbs";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import DashboardHeader from "../components/DashboardHeader";

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
  const [showVersionNotes, setShowVersionNotes] = useState(false);

  const draftOrPublishPending = versions.find(
    (v) =>
      v.state === DashboardState.Draft ||
      v.state === DashboardState.PublishPending
  );

  const closeArchiveModal = () => {
    setIsOpenArchiveModal(false);
  };

  const closeUpdateModal = () => {
    setIsOpenUpdateModal(false);
  };

  const onArchiveDashboard = () => {
    setIsOpenArchiveModal(true);
  };

  const onUpdateDashboard = () => {
    setIsOpenUpdateModal(true);
  };

  const updateDashboard = async () => {
    closeUpdateModal();

    try {
      const draft = await BackendService.createDraft(dashboardId);

      history.push(`/admin/dashboard/edit/${draft.id}`, {
        alert: {
          type: "success",
          message: `A new draft version of "${draft.name}" dashboard has been created`,
        },
        id: "top-alert",
      });
    } catch (err) {
      console.log("Failed to create draft", err);
    }
  };

  const archiveDashboard = async () => {
    closeArchiveModal();

    if (!dashboard) {
      return;
    }

    await BackendService.archive(dashboard.id, dashboard.updatedAt);

    history.push("/admin/dashboards?tab=archived", {
      alert: {
        type: "success",
        message: `${dashboard.name} was successfully archived`,
      },
    });
  };

  return (
    <>
      <div className="position-sticky top-0 bg-white z-index-on-top">
        <Breadcrumbs
          crumbs={[
            {
              label: "Dashboards",
              url: "/admin/dashboards?tab=published",
            },
            {
              label: dashboard?.name,
            },
          ]}
        />

        <Modal
          isOpen={isOpenUpdateModal}
          closeModal={closeUpdateModal}
          title={`Update "${dashboard?.name}" dashboard`}
          message={
            "This will create a new draft of the dashboard that will allow you to edit the content," +
            " then publish the new version to the published site."
          }
          buttonType="Create draft"
          buttonAction={updateDashboard}
        />

        <Modal
          isOpen={isOpenArchiveModal}
          closeModal={closeArchiveModal}
          title={`Archive "${dashboard?.name}" dashboard`}
          message={`This will remove "${dashboard?.name}" dashboard from the published site. You can re-publish archived dashboards at any time.`}
          buttonType="Archive"
          buttonAction={archiveDashboard}
        />

        {draftOrPublishPending && (
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
        <div className="grid-row margin-top-2">
          <div className="grid-col text-left">
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
                <Button
                  variant="unstyled"
                  type="button"
                  className="margin-left-1 margin-top-1 text-base-dark hover:text-base-darker active:text-base-darkest"
                  onClick={() => setShowVersionNotes(!showVersionNotes)}
                >
                  {`${showVersionNotes ? "Hide" : "Show"} version notes`}
                </Button>
              </li>
            </ul>
          </div>
          <div className="grid-col text-right">
            <Button
              variant="outline"
              type="button"
              onClick={onArchiveDashboard}
            >
              Archive
            </Button>
            <Button
              variant="base"
              onClick={onUpdateDashboard}
              disabled={!!draftOrPublishPending}
            >
              Update
            </Button>
          </div>
        </div>
        {showVersionNotes && (
          <>
            <div className="margin-top-3 text-bold font-sans-sm">
              {`Version ${dashboard?.version} notes from `}
              <span className="text-underline">{dashboard?.createdBy}</span>
            </div>
            <div className="margin-top-2 text-base">
              {dashboard?.releaseNotes}
            </div>
          </>
        )}
        <div className="margin-top-2 gradient height-2" />
      </div>

      {loading ? (
        <Spinner className="text-center margin-top-9" label="Loading" />
      ) : (
        <>
          <DashboardHeader
            name={dashboard?.name}
            topicAreaName={dashboard?.topicAreaName}
            description={dashboard?.description}
          />
          <hr />
          {dashboard?.widgets.map((widget, index) => {
            return (
              <div className="margin-top-5" key={index}>
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
