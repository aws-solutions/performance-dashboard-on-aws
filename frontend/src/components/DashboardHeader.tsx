import React from "react";
import MarkdownRender from "../components/MarkdownRender";

interface Props {
  name?: string;
  topicAreaName?: string;
  description?: string;
  unpublished?: boolean;
  link?: React.ReactNode;
}

function DashboardHeader(props: Props) {
  return (
    <>
      <div className={props.unpublished ? "" : "margin-top-2"}>
        <h1
          className={`display-inline-block ${
            props.unpublished
              ? "margin-bottom-0"
              : "margin-bottom-1 font-sans-2xl"
          }`}
        >
          {props.name}
        </h1>
        {props.link}
        <div className="text-base text-italic margin-bottom-2">
          {props.topicAreaName}
        </div>
      </div>
      <div className={props.unpublished ? "" : "margin-y-2"}>
        {props.description && (
          <MarkdownRender
            source={props.description}
            className={
              props.unpublished ? "" : "font-sans-lg usa-prose margin-top-0"
            }
          />
        )}
      </div>
    </>
  );
}

export default DashboardHeader;
