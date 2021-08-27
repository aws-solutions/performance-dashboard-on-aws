import React from "react";
import MarkdownRender from "./MarkdownRender";
import { Widget } from "../models";

interface Props {
  widget: Widget;
}

function TextWidget(props: Props) {
  const { content, showTitle, name } = props.widget;

  return (
    <div>
      {showTitle && <h2>{name}</h2>}
      <MarkdownRender
        className="usa-prose textOrSummary"
        source={content.text}
      />
    </div>
  );
}

export default TextWidget;
