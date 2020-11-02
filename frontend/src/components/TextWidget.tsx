import React from "react";
import MarkdownRender from "./MarkdownRender";
import { Widget } from "../models";

interface Props {
  widget: Widget;
}

function TextWidget(props: Props) {
  const { content } = props.widget;

  return (
    <div className="margin-left-1">
      <h2>{props.widget.name}</h2>
      <MarkdownRender source={content.text} />
    </div>
  );
}

export default TextWidget;
