import React, { useCallback, useEffect, useRef, useState } from "react";
// @ts-ignore
import { CategoricalChartWrapper } from "recharts";
import {
  XAxis,
  YAxis,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useColors, useYAxisMetadata } from "../hooks";
import UtilsService from "../services/UtilsService";
import TickFormatter from "../services/TickFormatter";
import MarkdownRender from "./MarkdownRender";
import DataTable from "./DataTable";
import RenderLegendText from "./Legend"
import { ColumnDataType } from "../models";

type Props = {
  title: string;
  downloadTitle: string;
  summary: string;
  lines: Array<string>;
  data?: Array<any>;
  summaryBelow: boolean;
  horizontalScroll?: boolean;
  setWidthPercent?: (widthPercent: number) => void;
  isPreview?: boolean;
  significantDigitLabels: boolean;
  colors?: {
    primary: string | undefined;
    secondary: string | undefined;
  };
  columnsMetadata: Array<any>;
  showMobilePreview?: boolean;
};

const LineChartWidget = (props: Props) => {
  const chartRef = useRef(null);
  const [linesHover, setLinesHover] = useState(null);
  const [hiddenLines, setHiddenLines] = useState<Array<string>>([]);
  const [chartLoaded, setChartLoaded] = useState(false);
  const { yAxisLargestValue, yAxisMargin } = useYAxisMetadata(
    chartRef,
    chartLoaded,
    props.significantDigitLabels
  );

  const colors = useColors(
    props.lines.length,
    props.colors?.primary,
    props.colors?.secondary
  );

  const pixelsByCharacter = 8;
  const previewWidth = 480;
  const fullWidth = 960;
  const padding = 60;

  const getOpacity = useCallback(
    (dataKey) => {
      if (!linesHover) {
        return 1;
      }
      return linesHover === dataKey ? 1 : 0.2;
    },
    [linesHover]
  );

  const { data, lines, showMobilePreview } = props;
  const xAxisType = useCallback(() => {
    let columnMetadata;
    if (props.columnsMetadata && lines.length) {
      columnMetadata = props.columnsMetadata.find(
        (cm) => cm.columnName === lines[0]
      );
    }
    if (columnMetadata && columnMetadata.dataType === ColumnDataType.Text) {
      return "category";
    } else {
      return data && data.every((row) => typeof row[lines[0]] === "number")
        ? "number"
        : "category";
    }
  }, [data, lines, props.columnsMetadata]);

  const toggleLines = (e: any) => {
    if (hiddenLines.includes(e.dataKey)) {
      const hidden = hiddenLines.filter((line) => line !== e.dataKey);
      setHiddenLines(hidden);
    } else {
      setHiddenLines([...hiddenLines, e.dataKey]);
    }
  };

  /**
   * Calculate the width percent out of the total width
   * depending on the container. Width: (largestHeader + 1) *
   * headersCount * pixelsByCharacter + marginLeft + marginRight
   */
  const widthPercent =
    (((UtilsService.getLargestHeader(lines, data) + 1) *
      (data ? data.length : 0) *
      pixelsByCharacter +
      50 +
      50) *
      100) /
    (props.isPreview ? previewWidth : fullWidth);

  useEffect(() => {
    if (props.setWidthPercent) {
      props.setWidthPercent(widthPercent);
    }
  }, [props, widthPercent]);

  return (
    <div
      aria-label={props.title}
      tabIndex={-1}
      className={`overflow-x-hidden overflow-y-hidden${
        widthPercent > 100 && props.horizontalScroll ? " scroll-shadow" : ""
      }`}
    >
      <h2 className={`margin-bottom-${props.summaryBelow ? "4" : "1"}`}>
        {props.title}
      </h2>
      {!props.summaryBelow && (
        <MarkdownRender
          source={props.summary}
          className="usa-prose margin-top-0 margin-bottom-4 chartSummaryAbove textOrSummary"
        />
      )}
      {data && data.length && (
        <ResponsiveContainer
          id={props.title}
          width={
            props.horizontalScroll ? `${Math.max(widthPercent, 100)}%` : "100%"
          }
          height={300}
          data-testid="chartContainer"
        >
          <LineChart
            className="line-chart"
            data={props.data}
            margin={{ right: 0, left: yAxisMargin }}
            ref={(el: CategoricalChartWrapper) => {
              chartRef.current = el;
              setChartLoaded(!!el);
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={props.lines.length ? props.lines[0] : ""}
              type={xAxisType()}
              padding={{ left: padding, right: padding }}
              domain={["dataMin", "dataMax"]}
              interval={props.horizontalScroll ? 0 : "preserveStartEnd"}
              scale={xAxisType() === "number" ? "linear" : "auto"}
            />
            <YAxis
              type="number"
              tickFormatter={(tick: any) => {
                return TickFormatter.format(
                  Number(tick),
                  yAxisLargestValue,
                  props.significantDigitLabels,
                  "",
                  ""
                );
              }}
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
                  yAxisLargestValue,
                  props.significantDigitLabels,
                  "",
                  "",
                  columnMetadata
                );
              }}
            />
            <Legend
              verticalAlign="top"
              onClick={toggleLines}
              iconType="plainline"
              onMouseLeave={() => setLinesHover(null)}
              onMouseEnter={(e: any) => setLinesHover(e.dataKey)}
              formatter={RenderLegendText}
            />
            {props.lines.length &&
              props.lines.slice(1).map((line, index) => {
                return (
                  <Line
                    dataKey={line}
                    type="monotone"
                    stroke={colors[index]}
                    key={index}
                    strokeWidth={2}
                    dot={{ strokeDasharray: "1 0" }}
                    strokeDasharray={`${index * 5} ${index * 5}`}
                    strokeOpacity={getOpacity(line)}
                    hide={hiddenLines.includes(line)}
                    isAnimationActive={false}
                  />
                );
              })}
          </LineChart>
        </ResponsiveContainer>
      )}
      <div>
        <DataTable
          rows={data || []}
          columns={lines}
          columnsMetadata={props.columnsMetadata}
          fileName={props.downloadTitle}
          showMobilePreview={showMobilePreview}
        />
      </div>
      {props.summaryBelow && (
        <div>
          <MarkdownRender
            source={props.summary}
            className="usa-prose margin-top-1 margin-bottom-0 chartSummaryBelow textOrSummary"
          />
        </div>
      )}
    </div>
  );
};

export default LineChartWidget;
