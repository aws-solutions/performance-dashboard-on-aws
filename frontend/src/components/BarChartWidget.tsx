import React, { useCallback, useState, useRef } from "react";
// @ts-ignore
import { CategoricalChartWrapper } from "recharts";
import {
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Legend,
  LabelList,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useColors, useXAxisMetadata } from "../hooks";
import UtilsService from "../services/UtilsService";
import TickFormatter from "../services/TickFormatter";
import MarkdownRender from "./MarkdownRender";
import DataTable from "./DataTable";
import { ColumnDataType } from "../models";

type Props = {
  title: string;
  summary: string;
  bars: Array<string>;
  data?: Array<any>;
  summaryBelow: boolean;
  hideLegend?: boolean;
  significantDigitLabels: boolean;
  colors?: {
    primary: string | undefined;
    secondary: string | undefined;
  };
  columnsMetadata: Array<any>;
  hideDataLabels?: boolean;
};

const BarChartWidget = (props: Props) => {
  const chartRef = useRef(null);
  const [barsHover, setBarsHover] = useState(null);
  const [hiddenBars, setHiddenBars] = useState<Array<string>>([]);
  const [chartLoaded, setChartLoaded] = useState(false);
  const { xAxisLargestValue } = useXAxisMetadata(
    chartRef,
    chartLoaded,
    props.significantDigitLabels
  );

  const colors = useColors(
    props.bars.length,
    props.colors?.primary,
    props.colors?.secondary
  );

  const pixelsByCharacter = 8;
  const yAxisWidthOffset = 24;
  const yAxisLabelMaxWidth = 220;

  const getOpacity = useCallback(
    (dataKey) => {
      if (!barsHover) {
        return 1;
      }
      return barsHover === dataKey ? 1 : 0.2;
    },
    [barsHover]
  );

  const { data, bars } = props;
  const yAxisType = useCallback(() => {
    let columnMetadata;
    if (props.columnsMetadata && bars.length) {
      columnMetadata = props.columnsMetadata.find(
        (cm) => cm.columnName === bars[0]
      );
    }
    if (columnMetadata && columnMetadata.dataType === ColumnDataType.Text) {
      return "category";
    } else {
      return data && data.every((row) => typeof row[bars[0]] === "number")
        ? "number"
        : "category";
    }
  }, [data, bars]);

  const toggleBars = (e: any) => {
    if (hiddenBars.includes(e.dataKey)) {
      const hidden = hiddenBars.filter((bar) => bar !== e.dataKey);
      setHiddenBars(hidden);
    } else {
      setHiddenBars([...hiddenBars, e.dataKey]);
    }
  };

  const formatYAxisLabel = (label: string) =>
    label.length > 27 ? label.substr(0, 27).concat("...") : label;

  return (
    <div>
      <h2 className={`margin-bottom-${props.summaryBelow ? "4" : "1"}`}>
        {props.title}
      </h2>
      {!props.summaryBelow && (
        <MarkdownRender
          source={props.summary}
          className="usa-prose margin-top-0 margin-bottom-4 chartSummaryAbove"
        />
      )}
      {data && data.length && (
        <ResponsiveContainer
          width="100%"
          height={
            (data && data.length > 15) ||
            (data && data[0] && Object.keys(data[0]).length > 4)
              ? 800
              : 400
          }
        >
          <BarChart
            className="bar-chart"
            data={props.data}
            layout="vertical"
            margin={{ right: 0, left: 0 }}
            ref={(el: CategoricalChartWrapper) => {
              chartRef.current = el;
              setChartLoaded(!!el);
            }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(tick) =>
                TickFormatter.format(
                  tick,
                  xAxisLargestValue,
                  props.significantDigitLabels
                )
              }
            />
            <YAxis
              dataKey={props.bars.length ? props.bars[0] : ""}
              type={yAxisType()}
              width={Math.min(
                UtilsService.getLargestHeader(props.bars, props.data) *
                  pixelsByCharacter +
                  yAxisWidthOffset,
                yAxisLabelMaxWidth
              )}
              minTickGap={0}
              domain={["dataMin - 1", "dataMax + 1"]}
              scale={yAxisType() === "number" ? "linear" : "auto"}
              tickFormatter={formatYAxisLabel}
              reversed={true}
            />
            <Tooltip
              itemStyle={{ color: "#1b1b1b" }}
              isAnimationActive={false}
              formatter={(value: Number | String, name: string) => {
                // Check if there is metadata for this column
                let columnMetadata;
                if (props.columnsMetadata) {
                  columnMetadata = props.columnsMetadata.find(
                    (cm) => cm.columnName === name
                  );
                }

                return TickFormatter.format(
                  value,
                  xAxisLargestValue,
                  props.significantDigitLabels,
                  columnMetadata
                );
              }}
            />
            {!props.hideLegend && (
              <Legend
                verticalAlign="top"
                onClick={toggleBars}
                onMouseLeave={() => setBarsHover(null)}
                onMouseEnter={(e: any) => setBarsHover(e.dataKey)}
              />
            )}
            {props.bars.length &&
              props.bars.slice(1).map((bar, index) => {
                return (
                  <Bar
                    dataKey={bar}
                    fill={colors[index]}
                    key={index}
                    fillOpacity={getOpacity(bar)}
                    hide={hiddenBars.includes(bar)}
                    isAnimationActive={false}
                  >
                    {!props.hideDataLabels ? (
                      <LabelList
                        dataKey={bar}
                        position="right"
                        formatter={(tick: any) =>
                          TickFormatter.format(
                            tick,
                            xAxisLargestValue,
                            props.significantDigitLabels,
                            props.columnsMetadata[index]
                          )
                        }
                      />
                    ) : (
                      ""
                    )}
                  </Bar>
                );
              })}
          </BarChart>
        </ResponsiveContainer>
      )}
      {props.summaryBelow && (
        <MarkdownRender
          source={props.summary}
          className="usa-prose margin-top-1 margin-bottom-0 chartSummaryBelow"
        />
      )}
      <DataTable
        rows={data || []}
        columns={bars}
        columnsMetadata={props.columnsMetadata}
      />
    </div>
  );
};

export default BarChartWidget;
