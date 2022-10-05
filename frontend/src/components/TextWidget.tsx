import React from "react";
import MarkdownRender from "./MarkdownRender";
import { Widget } from "../models";
import ShareButton from "./ShareButton";
import Utils from "../services/UtilsService";

interface Props {
  widget: Widget;
  hideTitle?: boolean;
}

function TextWidget(props: Props) {
  const { content, showTitle, name } = props.widget;

  const textId = `text-${Utils.getShorterId(props.widget.id)}`;
  return (
    <div
      id={textId}
      aria-label={name}
      tabIndex={-1}
      className={props.hideTitle ? "margin-top-3" : ""}
    >
      {!props.hideTitle && showTitle && (
        <h2>
          {name}
          <ShareButton
            id={`${textId}a`}
            title={name}
            className="margin-left-1"
          />
        </h2>
      )}
      <MarkdownRender
        className="usa-prose textOrSummary"
        source={content.text}
      />
    </div>
  );
}

export default TextWidget;
