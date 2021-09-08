import React from "react";
import MarkdownRender from "./MarkdownRender";
import { Widget } from "../models";

interface Props {
  widget: Widget;
  hideTitle?: boolean;
}

function TextWidget(props: Props) {
  const { content, showTitle, name } = props.widget;

  return (
    <div className={props.hideTitle ? "margin-top-3" : ""}>
      {!props.hideTitle && showTitle && <h2>{name}</h2>}
      <MarkdownRender
        className="usa-prose textOrSummary"
        source={content.text}
      />
    </div>
  );
}

export default TextWidget;
