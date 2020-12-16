import React from "react";
import { useParams, Redirect } from "react-router-dom";
import Link from "../components/Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { usePublicDashboard } from "../hooks";
import WidgetRender from "../components/WidgetRender";
import Spinner from "../components/Spinner";
import DashboardHeader from "../components/DashboardHeader";

interface PathParams {
  friendlyURL: string;
}

function ViewDashboard() {
  const { friendlyURL } = useParams<PathParams>();
  const { dashboard, loading, dashboardNotFound } = usePublicDashboard(
    friendlyURL
  );

  if (dashboardNotFound) {
    return <Redirect to="/404/page-not-found" />;
  }

  return loading || dashboard === undefined ? (
    <Spinner
      style={{
        position: "fixed",
        top: "30%",
        left: "50%",
      }}
      label="Loading"
    />
  ) : (
    <>
      <Link to="/">
        <FontAwesomeIcon icon={faArrowLeft} /> All Dashboards
      </Link>
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
  );
}

export default ViewDashboard;
