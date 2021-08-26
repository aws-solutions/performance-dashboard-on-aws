import React from "react";
import MarkdownRender from "./MarkdownRender";
import { Widget } from "../models";

interface Props {
  widget: Widget;
}

function SectionWidget(props: Props) {
  const { content, showTitle } = props.widget;

  return (
    <div>
      {showTitle && <h1>{content.title}</h1>}
      {content.summary ? (
        <div className="padding-left-05">
          <MarkdownRender className="usa-prose" source={content.summary} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default SectionWidget;
