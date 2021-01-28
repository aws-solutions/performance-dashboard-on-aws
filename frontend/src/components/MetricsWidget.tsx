import React from "react";
import { useJsonDataset } from "../hooks";
import { MetricsWidget } from "../models";
import MetricsPreview from "./MetricsPreview";

interface Props {
  widget: MetricsWidget;
}

function MetricsWidgetComponent(props: Props) {
  const { showTitle, content } = props.widget;
  const { json } = useJsonDataset(content.s3Key.json);

  if (!json) {
    return null;
  }

  return (
    <MetricsPreview
      title={showTitle ? content.title : ""}
      metrics={json}
      metricPerRow={content.oneMetricPerRow ? 1 : 3}
    />
  );
}

export default MetricsWidgetComponent;
