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
    <div>
      <h2 className="margin-top-4">{title}</h2>
      {metrics.length ? (
        <div>
          <MetricsCardGroup metrics={metrics} metricPerRow={metricPerRow} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default MetricsWidget;
