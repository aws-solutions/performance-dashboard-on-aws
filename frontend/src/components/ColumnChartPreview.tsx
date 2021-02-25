import React, { useCallback, useState } from "react";
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

const ColumnChartPreview = (props: Props) => {
  const [columnsHover, setColumnsHover] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState<Array<string>>([]);

  const colors = useColors(
    props.columns.length,
    props.colors?.primary,
    props.colors?.secondary
  );

  const pixelsByCharacter = 8;
  const previewWidth = 480;
  const fullWidth = 960;

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
   * depending on the container.
   */
  const widthPercent =
    (UtilsService.getLargestHeader(columns, data) *
      (data ? data.length : 0) *
      pixelsByCharacter *
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
          width={`${Math.max(widthPercent, 100)}%`}
          height={300}
        >
          <BarChart data={props.data} margin={{ right: 0, left: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={props.columns.length ? props.columns[0] : ""}
              type={xAxisType()}
              padding={{ left: 20, right: 20 }}
              domain={[0, "dataMax"]}
              interval={0}
            />
            <YAxis type="number" domain={[0, "dataMax"]} />
            <Tooltip cursor={{ fill: "#F0F0F0" }} isAnimationActive={false} />
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
                  />
                );
              })}
          </BarChart>
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

export default ColumnChartPreview;
