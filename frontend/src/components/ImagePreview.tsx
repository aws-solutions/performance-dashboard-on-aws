import React from "react";
import "./TablePreview.css";

type Props = {
  title: string;
  summary: string;
  file: File | undefined;
  summaryBelow: boolean;
};

const ImagePreview = (props: Props) => {
  const { file, summaryBelow, summary, title } = props;

  return (
    <div className="preview-container">
      <h2 className="margin-left-1 margin-bottom-1">{title}</h2>
      {!summaryBelow && (
        <p className="margin-left-1 margin-top-0 margin-bottom-3">{summary}</p>
      )}
      <img src={file ? URL.createObjectURL(file) : ""}></img>
      {summaryBelow && (
        <p className="margin-left-1 margin-top-3 margin-bottom-0">{summary}</p>
      )}
    </div>
  );
};

export default ImagePreview;
