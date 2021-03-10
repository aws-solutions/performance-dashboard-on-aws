import React from "react";
import MarkdownRender from "./MarkdownRender";
import { Widget } from "../models";

interface Props {
  widget: Widget;
}

function TextWidget(props: Props) {
  const { content, showTitle, name } = props.widget;

  return (
    <div className="margin-left-1">
      {showTitle && <h2>{name}</h2>}
      <MarkdownRender className="usa-prose" source={content.text} />
    </div>
  );
}

export default TextWidget;
