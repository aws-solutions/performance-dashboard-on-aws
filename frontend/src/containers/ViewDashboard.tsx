import React from "react";
import { useParams, Redirect } from "react-router-dom";
import Link from "../components/Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { usePublicDashboard } from "../hooks";
import { useTranslation } from "react-i18next";
import WidgetRender from "../components/WidgetRender";
import Spinner from "../components/Spinner";
import DashboardHeader from "../components/DashboardHeader";

interface PathParams {
  friendlyURL: string;
}

function ViewDashboard() {
  const { friendlyURL } = useParams<PathParams>();
  const { t } = useTranslation();
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
        <FontAwesomeIcon icon={faArrowLeft} /> {t("AllDashboardsLink")}
      </Link>
      <DashboardHeader
        name={dashboard.name}
        topicAreaName={dashboard.topicAreaName}
        description={dashboard.description}
        lastUpdated={dashboard.updatedAt}
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
  );
}

export default ViewDashboard;
