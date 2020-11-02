import React from "react";
import ReactMarkdown from "react-markdown";
import { Widget } from "../models";

interface Props {
  widget: Widget;
}

function TextWidget(props: Props) {
  const { content } = props.widget;

  return (
    <div className="margin-left-1">
      <h2>{props.widget.name}</h2>
      <ReactMarkdown
        source={content.text}
        allowedTypes={[
          "heading",
          "link",
          "list",
          "listItem",
          "paragraph",
          "root",
          "strong",
          "text",
        ]}
      />
    </div>
  );
}

export default TextWidget;
