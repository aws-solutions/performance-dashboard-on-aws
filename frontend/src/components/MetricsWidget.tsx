import React from "react";
import { Metric } from "../models";
import MetricsCardGroup from "../components/MetricsCardGroup";

type Props = {
  title: string;
  metrics: Array<Metric>;
  metricPerRow: number;
  significantDigitLabels: boolean;
};

const MetricsWidget = ({
  title,
  metrics,
  metricPerRow,
  significantDigitLabels,
}: Props) => {
  return (
    <div>
      <h2 className="margin-top-3">{title}</h2>
      {metrics.length ? (
        <div>
          <MetricsCardGroup
            metrics={metrics}
            metricPerRow={metricPerRow}
            significantDigitLabels={significantDigitLabels}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default MetricsWidget;
