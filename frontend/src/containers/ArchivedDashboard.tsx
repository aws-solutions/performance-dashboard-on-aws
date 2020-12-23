import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { useDashboard } from "../hooks";
import { LocationState } from "../models";
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

function ArchivedDashboard() {
  const history = useHistory<LocationState>();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const [isOpenRepublishModal, setIsOpenRepublishModal] = useState(false);

  const closeRepublishModal = () => {
    setIsOpenRepublishModal(false);
  };

  const onRepublishDashboard = () => {
    setIsOpenRepublishModal(true);
  };

  const republishDashboard = async () => {
    closeRepublishModal();

    if (dashboard) {
      await BackendService.publishDashboard(
        dashboard.id,
        dashboard.updatedAt,
        dashboard.releaseNotes || ""
      );
      history.push(`/admin/dashboards?tab=published`, {
        alert: {
          type: "success",
          message: `${dashboard.name} dashboard was successfully re-published`,
          to: `/${dashboardId}`,
          linkLabel: "View the published dashboard",
        },
      });
    }
  };

  return (
    <>
      <div className="position-sticky top-0 bg-white z-index-on-top">
        <Breadcrumbs
          crumbs={[
            {
              label: "Dashboards",
              url: "/admin/dashboards?tab=archived",
            },
            {
              label: dashboard?.name,
            },
          ]}
        />

        <Modal
          isOpen={isOpenRepublishModal}
          closeModal={closeRepublishModal}
          title={`Re-publish "${dashboard?.name}" dashboard`}
          message="Are you sure you want to re-publish this dashboard?"
          buttonType="Re-publish"
          buttonAction={republishDashboard}
        />

        <Alert
          type="info"
          slim
          message="This dashboard is archived. It is not viewable on the published site unless it is re-published"
        />
        <div className="grid-row margin-top-2">
          <div className="grid-col text-left">
            <ul className="usa-button-group">
              <li className="usa-button-group__item">
                <span className="usa-tag" style={{ cursor: "text" }}>
                  {dashboard?.state}
                </span>
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
            <Button variant="base" type="button" onClick={onRepublishDashboard}>
              Re-publish
            </Button>
          </div>
        </div>
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

export default ArchivedDashboard;
