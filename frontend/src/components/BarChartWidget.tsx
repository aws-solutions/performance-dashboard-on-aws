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
import { ColumnDataType, CurrencyDataType, NumberDataType } from "../models";

type Props = {
  title: string;
  downloadTitle: string;
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
  showMobilePreview?: boolean;
  stackedChart?: boolean;
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

  const { data, bars, showMobilePreview } = props;

  const columnsMetadataDict = new Map();
  props.columnsMetadata.forEach((el) =>
    columnsMetadataDict.set(el.columnName, el)
  );

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
  }, [data, bars, props.columnsMetadata]);

  const toggleBars = (e: any) => {
    if (hiddenBars.includes(e.dataKey)) {
      const hidden = hiddenBars.filter((bar) => bar !== e.dataKey);
      setHiddenBars(hidden);
    } else {
      setHiddenBars([...hiddenBars, e.dataKey]);
    }
  };

  const valueAccessor =
    (attribute: string) =>
    ({ payload }: any) => {
      return payload;
    };

  const formatYAxisLabel = (label: string) =>
    label.length > 27 ? label.substr(0, 27).concat("...") : label;

  const calculateChartHeight = (): number => {
    // When there are 15 rows of data and each row has 3 columns (excluding row
    // name), having a chart height of 400px is still visually appealing to users.
    // Adding more rows or columns would require additional height increments.
    const defaultNumRows = 15;
    const defaultNumCols = 3;
    const unitHeight = 400;
    let multiplicity;

    if (data && data.length) {
      const numRows = data.length;
      const numCols = Object.keys(data[0]).length - 1;
      const rowMultiplicity = Math.floor((numRows - 1) / defaultNumRows) + 1;
      const colMultiplicity = Math.floor((numCols - 1) / defaultNumCols) + 1;
      multiplicity = rowMultiplicity * colMultiplicity;
    } else {
      multiplicity = 1;
    }

    return unitHeight * multiplicity;
  };

  return (
    <div>
      <h3 className={`margin-bottom-${props.summaryBelow ? "4" : "1"}`}>
        {props.title}
      </h3>
      {!props.summaryBelow && (
        <MarkdownRender
          source={props.summary}
          className="usa-prose margin-top-0 margin-bottom-4 chartSummaryAbove textOrSummary"
        />
      )}
      {data && data.length && (
        <ResponsiveContainer width="100%" height={calculateChartHeight()}>
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
                  Number(tick),
                  xAxisLargestValue,
                  props.significantDigitLabels,
                  "",
                  ""
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
                  Number(value),
                  xAxisLargestValue,
                  props.significantDigitLabels,
                  "",
                  "",
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
                    stackId={props.stackedChart ? "a" : `${index}`}
                    isAnimationActive={false}
                  >
                    {!props.hideDataLabels && props.stackedChart && (
                      <LabelList
                        position="right"
                        valueAccessor={valueAccessor(bar)}
                        formatter={(tick: any) => {
                          return TickFormatter.stackedFormat(
                            tick,
                            xAxisLargestValue,
                            props.significantDigitLabels,
                            props.bars.slice(1),
                            props.columnsMetadata
                          );
                        }}
                      />
                    )}
                    {!props.hideDataLabels && !props.stackedChart && (
                      <LabelList
                        dataKey={bar}
                        position="right"
                        formatter={(tick: any) =>
                          TickFormatter.format(
                            Number(tick),
                            xAxisLargestValue,
                            props.significantDigitLabels,
                            "",
                            "",
                            columnsMetadataDict.get(bar)
                          )
                        }
                      />
                    )}
                  </Bar>
                );
              })}
          </BarChart>
        </ResponsiveContainer>
      )}
      <div style={showMobilePreview ? { float: "left" } : {}}>
        <DataTable
          rows={data || []}
          columns={bars}
          columnsMetadata={props.columnsMetadata}
          fileName={props.downloadTitle}
        />
      </div>
      {props.summaryBelow && (
        <div style={showMobilePreview ? { clear: "left" } : {}}>
          <MarkdownRender
            source={props.summary}
            className="usa-prose margin-top-1 margin-bottom-0 chartSummaryBelow textOrSummary"
          />
        </div>
      )}
    </div>
  );
};

export default BarChartWidget;
