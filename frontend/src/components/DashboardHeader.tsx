import React from "react";
import MarkdownRender from "../components/MarkdownRender";
import "./DashboardHeader.css";

interface DashboardHeaderProps {
  name?: string;
  topicAreaName?: string;
  description?: string;
  unpublished?: boolean;
  link?: React.ReactNode;
}

function DashboardHeader({
  name,
  topicAreaName,
  description,
  unpublished,
  link,
}: DashboardHeaderProps) {
  return (
    <>
      <div className={unpublished ? "" : "margin-top-2"}>
        <h1
          className={`display-inline-block ${
            unpublished ? "margin-bottom-0" : "margin-bottom-1 font-sans-2xl"
          }`}
        >
          {name}
        </h1>
        {link}
        <div className="text-base text-italic topic-area-name">
          {topicAreaName}
        </div>
      </div>
      <div className={unpublished ? "" : "margin-y-2"}>
        {description && (
          <MarkdownRender
            source={description}
            className={unpublished ? "" : "font-sans-lg usa-prose description"}
          />
        )}
      </div>
    </>
  );
}

DashboardHeader.defaultProps = { unpublished: false };
export default DashboardHeader;
