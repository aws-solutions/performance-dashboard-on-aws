import React from "react";
import MarkdownRender from "./MarkdownRender";

type Props = {
  title: string;
  summary: string;
  file: File | undefined;
  summaryBelow: boolean;
  altText: string;
  scalePct: string;
};

const ImageWidget = (props: Props) => {
  const { file, summaryBelow, summary, title, altText, scalePct } = props;

  return (
    <div className="preview-container">
      <h3 className="margin-top-3">{title}</h3>
      {!summaryBelow && (
        <MarkdownRender
          source={summary}
          className="usa-prose margin-top-0 margin-bottom-3 imageSummaryAbove textOrSummary"
        />
      )}
      <div>
        <img
          src={file ? URL.createObjectURL(file) : ""}
          alt={altText}
          width={scalePct}
          height="auto"
        ></img>
      </div>
      {summaryBelow && (
        <MarkdownRender
          source={summary}
          className="usa-prose margin-top-3 margin-bottom-0 imageSummaryBelow textOrSummary"
        />
      )}
    </div>
  );
};

export default ImageWidget;
