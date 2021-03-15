import React, { useCallback, useEffect, useRef, useState } from "react";
// @ts-ignore
import { CategoricalChartWrapper } from "recharts";
import {
  XAxis,
  YAxis,
  BarChart,
  Bar,
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
  columns: Array<string>;
  data?: Array<any>;
  summaryBelow: boolean;
  isPreview?: boolean;
  hideLegend?: boolean;
  colors?: {
    primary: string | undefined;
    secondary: string | undefined;
  };
};

const ColumnChartWidget = (props: Props) => {
  const [columnsHover, setColumnsHover] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState<Array<string>>([]);
  const [yAxisMargin, setYAxisMargin] = useState(0);
  const [chartLoaded, setChartLoaded] = useState(false);

  const colors = useColors(
    props.columns.length,
    props.colors?.primary,
    props.colors?.secondary
  );

  const pixelsByCharacter = 8;
  const previewWidth = 480;
  const fullWidth = 960;

  /**
   * Calculate the YAxis margin needed. This is important after we started
   * showing the ticks numbers as locale strings and commas are being
   * added. Margin: Count the commas in the largestTick to locale string, and
   * multiply by pixelsByCharacter.
   */
  const columnChartRef = useRef(null);
  useEffect(() => {
    if (columnChartRef && columnChartRef.current) {
      const yAxisMap = (columnChartRef.current as CategoricalChartWrapper).state
        .yAxisMap;
      if (yAxisMap && yAxisMap[0]) {
        const largestTick: number = Math.max(...yAxisMap[0].niceTicks);
        const largestTickLocaleString: string = largestTick.toLocaleString();
        const numberOfCommas: number =
          largestTickLocaleString.match(/,/g)?.length || 0;
        setYAxisMargin(numberOfCommas * pixelsByCharacter);
      }
    }
  }, [columnChartRef, columnChartRef.current, chartLoaded]);

  const getOpacity = useCallback(
    (dataKey) => {
      if (!columnsHover) {
        return 1;
      }
      return columnsHover === dataKey ? 1 : 0.2;
    },
    [columnsHover]
  );

  const { data, columns } = props;
  const xAxisType = useCallback(() => {
    return data && data.every((row) => typeof row[columns[0]] === "number")
      ? "number"
      : "category";
  }, [data, columns]);

  const toggleColumns = (e: any) => {
    if (hiddenColumns.includes(e.dataKey)) {
      const hidden = hiddenColumns.filter((column) => column !== e.dataKey);
      setHiddenColumns(hidden);
    } else {
      setHiddenColumns([...hiddenColumns, e.dataKey]);
    }
  };

  /**
   * Calculate the width percent out of the total width
   * depending on the container. Width: (largestHeader + 1) *
   * headersCount * pixelsByCharacter + marginLeft + marginRight
   */
  const widthPercent =
    (((UtilsService.getLargestHeader(columns, data) + 1) *
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
          width={`${Math.max(widthPercent, 100)}%`}
          height={300}
        >
          <BarChart
            className="column-chart"
            data={props.data}
            margin={{ right: 0, left: yAxisMargin }}
            ref={(el: CategoricalChartWrapper) => {
              columnChartRef.current = el;
              setChartLoaded(!!el);
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={props.columns.length ? props.columns[0] : ""}
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
            {!props.hideLegend && (
              <Legend
                verticalAlign="top"
                onClick={toggleColumns}
                onMouseLeave={(e) => setColumnsHover(null)}
                onMouseEnter={(e) => setColumnsHover(e.dataKey)}
              />
            )}
            {props.columns.length &&
              props.columns.slice(1).map((column, index) => {
                return (
                  <Bar
                    dataKey={column}
                    fill={colors[index]}
                    key={index}
                    fillOpacity={getOpacity(column)}
                    hide={hiddenColumns.includes(column)}
                    isAnimationActive={false}
                  />
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
    </div>
  );
};

export default ColumnChartWidget;
