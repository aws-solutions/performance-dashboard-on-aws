import React from "react";
import MarkdownRender from "./MarkdownRender";

type Props = {
  title: string;
  summary: string;
  file: File | undefined;
  summaryBelow: boolean;
  altText: string;
};

const ImagePreview = (props: Props) => {
  const { file, summaryBelow, summary, title, altText } = props;

  return (
    <div className="preview-container">
      <h2 className="margin-left-1 margin-top-1">{title}</h2>
      {!summaryBelow && (
        <MarkdownRender
          source={summary}
          className="margin-left-1 margin-top-0 margin-bottom-3 imageSummaryAbove"
        />
      )}
      <div className="margin-left-1">
        <img src={file ? URL.createObjectURL(file) : ""} alt={altText}></img>
      </div>
      {summaryBelow && (
        <MarkdownRender
          source={summary}
          className="margin-left-1 margin-top-3 margin-bottom-0 imageSummaryBelow"
        />
      )}
    </div>
  );
};

export default ImagePreview;
