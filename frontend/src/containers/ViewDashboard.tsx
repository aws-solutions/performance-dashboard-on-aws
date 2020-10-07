import React from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { usePublicDashboard } from "../hooks";
import MainLayout from "../layouts/Main";
import WidgetRender from "../components/WidgetRender";

interface PathParams {
  dashboardId: string;
}

function ViewDashboard() {
  const { dashboardId } = useParams<PathParams>();
  const { dashboard } = usePublicDashboard(dashboardId);

  return (
    <MainLayout>
      <Link to="/">
        <FontAwesomeIcon icon={faArrowLeft} /> All Dashboards
      </Link>
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
    </MainLayout>
  );
}

export default ViewDashboard;
