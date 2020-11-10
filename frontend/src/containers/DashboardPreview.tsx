import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDashboard } from "../hooks";
import { DashboardState, LocationState } from "../models";
import MarkdownRender from "../components/MarkdownRender";
import Button from "../components/Button";
import BackendService from "../services/BackendService";
import Alert from "../components/Alert";
import WidgetRender from "../components/WidgetRender";
import Breadcrumbs from "../components/Breadcrumbs";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import "./DashboardPreview.css";

interface PathParams {
  dashboardId: string;
}

function DashboardPreview() {
  const history = useHistory<LocationState>();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const [isOpenPublishModal, setIsOpenPublishModal] = useState(false);

  const closePublishModal = () => {
    setIsOpenPublishModal(false);
  };

  const onPublishDashboard = () => {
    setIsOpenPublishModal(true);
  };

  const publishDashboard = async () => {
    closePublishModal();

    if (dashboard) {
      await BackendService.publishPending(dashboard.id, dashboard.updatedAt);
      history.push(`/admin/dashboard/${dashboard.id}/publish`, {
        alert: {
          type: "info",
          message:
            "This dashboard is now in the publish pending state " +
            "and cannot be edited unless returned to draft.",
        },
      });
    }
  };

  const onCancel = () => {
    history.push(
      dashboard?.state === DashboardState.PublishPending
        ? `/admin/dashboard/${dashboardId}/publish`
        : `/admin/dashboard/edit/${dashboardId}`
    );
  };

  return (
    <>
      <div className="position-sticky top-0 bg-white z-index-on-top">
        <Breadcrumbs
          crumbs={[
            {
              label: "Dashboards",
              url: "/admin/dashboards",
            },
            {
              label: dashboard?.name,
            },
          ]}
        />

        <Modal
          isOpen={isOpenPublishModal}
          closeModal={closePublishModal}
          title={`Publish "${dashboard?.name}" dashboard`}
          message="Are you sure you want to start the publishing process?"
          buttonType="Publish"
          buttonAction={publishDashboard}
        />

        <Alert
          type="info"
          message="Below is a preview of what the published dashboard will look like.
              If everything looks right, you can publish the dashboard to be
              viewable on the published site."
        />
        <div className="grid-row margin-top-2">
          <div className="grid-col text-left">
            <span className="usa-tag text-middle">Preview</span>
          </div>
          <div className="grid-col text-right">
            <Button variant="outline" type="button" onClick={onCancel}>
              Close Preview
            </Button>
            <Button
              variant="base"
              onClick={onPublishDashboard}
              disabled={dashboard?.state === DashboardState.PublishPending}
            >
              Publish
            </Button>
          </div>
        </div>
        <div className="margin-top-2 gradient height-4" />
      </div>

      {loading ? (
        <Spinner className="text-center margin-top-9" label="Loading" />
      ) : (
        <>
          <div>
            <h1 className="margin-bottom-0 display-inline-block">
              {dashboard?.name}
            </h1>
          </div>
          <div className="text-base text-italic">
            {dashboard?.topicAreaName}
          </div>
          <div>
            {dashboard?.description ? (
              <MarkdownRender source={dashboard.description} />
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
        </>
      )}
    </>
  );
}

export default DashboardPreview;
