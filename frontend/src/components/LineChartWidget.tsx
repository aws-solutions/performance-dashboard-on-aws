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
import { useColors } from "../hooks";
import UtilsService from "../services/UtilsService";
import MarkdownRender from "./MarkdownRender";

type Props = {
  title: string;
  summary: string;
  lines: Array<string>;
  data?: Array<any>;
  summaryBelow: boolean;
  isPreview?: boolean;
  colors?: {
    primary: string | undefined;
    secondary: string | undefined;
  };
};

const LineChartWidget = (props: Props) => {
  const [linesHover, setLinesHover] = useState(null);
  const [hiddenLines, setHiddenLines] = useState<Array<string>>([]);
  const [yAxisMargin, setYAxisMargin] = useState(0);
  const [chartLoaded, setChartLoaded] = useState(false);

  const colors = useColors(
    props.lines.length,
    props.colors?.primary,
    props.colors?.secondary
  );

  const pixelsByCharacter = 8;
  const previewWidth = 480;
  const fullWidth = 960;

  const lineChartRef = useRef(null);
  useEffect(() => {
    if (lineChartRef && lineChartRef.current) {
      const yAxisMap = (lineChartRef.current as CategoricalChartWrapper).state
        .yAxisMap;
      if (yAxisMap && yAxisMap.length) {
        setYAxisMargin(
          yAxisMap[0].niceTicks.toLocaleString().match(/,/g)?.length +
            pixelsByCharacter
        );
      }
    }
  }, [lineChartRef, lineChartRef.current, chartLoaded]);

  const getOpacity = useCallback(
    (dataKey) => {
      if (!linesHover) {
        return 1;
      }
      return linesHover === dataKey ? 1 : 0.2;
    },
    [linesHover]
  );

  const { data, lines } = props;
  const xAxisType = useCallback(() => {
    return data && data.every((row) => typeof row[lines[0]] === "number")
      ? "number"
      : "category";
  }, [data, lines]);

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

  return (
    <div
      className={`overflow-hidden${widthPercent > 100 ? " right-shadow" : ""}`}
    >
      <h2
        className={`margin-left-1 margin-bottom-${
          props.summaryBelow ? "4" : "1"
        }`}
      >
        {props.title}
      </h2>
      {!props.summaryBelow && (
        <MarkdownRender
          source={props.summary}
          className="margin-left-1 margin-top-0 margin-bottom-4 chartSummaryAbove"
        />
      )}
      {data && data.length && (
        <ResponsiveContainer
          id={props.title}
          width={`${Math.max(widthPercent, 100)}%`}
          height={300}
          data-testid="chartContainer"
        >
          <LineChart
            data={props.data}
            margin={{ right: 0, left: yAxisMargin }}
            ref={(el: CategoricalChartWrapper) => {
              lineChartRef.current = el;
              setChartLoaded(!!el);
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={props.lines.length ? props.lines[0] : ""}
              type={xAxisType()}
              padding={{ left: 50, right: 50 }}
              domain={["dataMin", "dataMax"]}
              interval={0}
              scale={xAxisType() === "number" ? "linear" : "auto"}
            />
            <YAxis
              type="number"
              tickFormatter={(tick) => {
                return tick.toLocaleString();
              }}
            />

            <Tooltip
              cursor={{ fill: "#F0F0F0" }}
              isAnimationActive={false}
              formatter={(value: Number | String) => value.toLocaleString()}
            />
            <Legend
              verticalAlign="top"
              onClick={toggleLines}
              onMouseLeave={(e) => setLinesHover(null)}
              onMouseEnter={(e) => setLinesHover(e.dataKey)}
            />
            {props.lines.length &&
              props.lines.slice(1).map((line, index) => {
                return (
                  <Line
                    dataKey={line}
                    type="monotone"
                    stroke={colors[index]}
                    key={index}
                    strokeWidth={3}
                    strokeOpacity={getOpacity(line)}
                    hide={hiddenLines.includes(line)}
                    isAnimationActive={false}
                  />
                );
              })}
          </LineChart>
        </ResponsiveContainer>
      )}
      {props.summaryBelow && (
        <MarkdownRender
          source={props.summary}
          className="margin-left-1 margin-top-1 margin-bottom-0 chartSummaryBelow"
        />
      )}
    </div>
  );
};

export default LineChartWidget;
