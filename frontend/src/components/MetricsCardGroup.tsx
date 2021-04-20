import React from "react";
import { Metric } from "../models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import TickFormatter from "../services/TickFormatter";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

interface Props {
  metrics: Array<Metric>;
  metricPerRow: number;
  significantDigitLabels: boolean;
}

function MetricsCardGroup(props: Props) {
  const { t } = useTranslation();
  let rows = [];
  for (let i = 0; i < props.metrics.length; i += props.metricPerRow) {
    let row = [];
    for (
      let j = i;
      j < i + props.metricPerRow && j < props.metrics.length;
      j++
    ) {
      const metric = props.metrics[j];
      row.push(metric);
    }
    rows.push(row);
  }

  if (!props.metrics.length) {
    return null;
  }

  return (
    <div className="grid-col">
      {rows.map((row, i) => {
        return (
          <div key={i} className="grid-row flex-column">
            <div className="grid-col grid-row flex-row">
              {row.map((metric, j) => {
                return (
                  <div
                    className={`grid-col-${12 / props.metricPerRow} padding-05`}
                    key={j}
                  >
                    <div className="display-flex flex-column border-base-lightest border-2px height-card padding-1 overflow-x-auto">
                      <div className="flex-5">
                        <p className="text-base-darkest text-bold margin-0 text-no-wrap">
                          {metric.title}
                        </p>
                      </div>
                      <div
                        className="flex-3 usa-tooltip"
                        data-position="bottom"
                        title={metric.value ? metric.value.toString() : ""}
                      >
                        <h1 className="margin-0 text-no-wrap">
                          {TickFormatter.format(
                            Number(metric.value),
                            Number(metric.value),
                            props.significantDigitLabels
                          )}
                        </h1>
                      </div>
                      <div className="flex-2">
                        {metric.changeOverTime && (
                          <div className="margin-top-05">
                            <FontAwesomeIcon
                              size="xs"
                              icon={
                                metric.changeOverTime[0] === "-"
                                  ? faArrowDown
                                  : faArrowUp
                              }
                              className="margin-right-2px"
                            />
                            {metric.changeOverTime.substring(1)}
                          </div>
                        )}
                      </div>
                      <div className="flex-2">
                        {metric.startDate && metric.endDate && (
                          <div className="margin-top-1px">
                            <span>
                              {dayjs(metric.startDate).format("MMM YYYY")}
                            </span>{" "}
                            {t("To")}{" "}
                            <span>
                              {dayjs(metric.endDate).format("MMM YYYY")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MetricsCardGroup;
