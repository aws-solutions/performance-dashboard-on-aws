import React from "react";
import MarkdownRender from "../components/MarkdownRender";
import "./DashboardHeader.css";

interface DashboardHeaderProps {
  name?: string;
  topicAreaName?: string;
  description?: string;
}

function DashboardHeader({
  name,
  topicAreaName,
  description,
}: DashboardHeaderProps) {
  return (
    <>
      <div className="margin-top-2">
        <h1 className="margin-bottom-1 display-inline-block font-sans-2xl">
          {name}
        </h1>
        <div className="text-base text-italic topic-area-name">
          {topicAreaName}
        </div>
      </div>
      <div className="margin-y-2">
        {description && (
          <MarkdownRender
            source={description}
            className="font-sans-lg usa-prose description"
          />
        )}
      </div>
    </>
  );
}

export default DashboardHeader;
