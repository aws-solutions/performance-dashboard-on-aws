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
    <div
      aria-label={name}
      tabIndex={-1}
      className={props.hideTitle ? "margin-top-3" : ""}
    >
      {!props.hideTitle && showTitle && <h3>{name}</h3>}
      <MarkdownRender
        className="usa-prose textOrSummary"
        source={content.text}
      />
    </div>
  );
}

export default TextWidget;
