import React from "react";
import { Metric } from "../models";
import MetricsCardGroup from "../components/MetricsCardGroup";

type Props = {
  title: string;
  metrics: Array<Metric>;
  metricPerRow: number;
};

const MetricsWidget = (props: Props) => {
  const { title, metrics, metricPerRow } = props;

  return (
    <>
      <h2 className="margin-top-4 margin-left-1">{title}</h2>
      {metrics.length ? (
        <div className="margin-left-1">
          <MetricsCardGroup metrics={metrics} metricPerRow={metricPerRow} />
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default MetricsWidget;
