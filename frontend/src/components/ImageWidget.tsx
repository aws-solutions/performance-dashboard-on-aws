import React from "react";
import { ImageWidget } from "../models";
import ImagePreview from "../components/ImagePreview";
import { useImage } from "../hooks";

interface Props {
  widget: ImageWidget;
}

function ImageWidgetComponent(props: Props) {
  const { showTitle, content } = props.widget;
  const file = useImage(content.s3Key.raw);

  return (
    <ImagePreview
      title={showTitle ? content.title : ""}
      summary={content.summary ? content.summary : ""}
      summaryBelow={content.summaryBelow}
      file={file.file}
      altText={content.imageAltText}
    />
  );
}

export default ImageWidgetComponent;
