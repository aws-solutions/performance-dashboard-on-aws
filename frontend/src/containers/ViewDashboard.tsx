import React from "react";
import { useParams } from "react-router-dom";
import Link from "../components/Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { usePublicDashboard } from "../hooks";
import WidgetRender from "../components/WidgetRender";
import FourZeroFour from "./FourZeroFour";
import FooterLayout from "../layouts/Footer";
import Spinner from "../components/Spinner";
import DashboardHeader from "../components/DashboardHeader";

interface PathParams {
  dashboardId: string;
}

function ViewDashboard() {
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, loading } = usePublicDashboard(dashboardId);

  return loading || dashboard === undefined ? (
    <Spinner
      style={{
        position: "fixed",
        top: "30%",
        left: "50%",
      }}
      label="Loading"
    />
  ) : dashboard.id ? (
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
  ) : (
    <FooterLayout>
      <FourZeroFour />
    </FooterLayout>
  );
}

export default ViewDashboard;
