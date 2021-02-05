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

type Props = {
  title: string;
  summary: string;
  columns: Array<string>;
  data?: Array<any>;
  summaryBelow: boolean;
};

const ColumnChartPreview = (props: Props) => {
  const [columnsHover, setColumnsHover] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState<Array<string>>([]);
  const colors = useColors(props.columns.length);

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

  return (
    <div>
      <h2 className="margin-left-1 margin-bottom-1">{props.title}</h2>
      {!props.summaryBelow && (
        <p className="margin-left-1 margin-top-0 margin-bottom-2">
          {props.summary}
        </p>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={props.data} margin={{ right: 0, left: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={props.columns.length ? props.columns[0] : ""}
            type={xAxisType()}
            padding={{ left: 20, right: 20 }}
            domain={[0, "dataMax"]}
          />
          <YAxis type="number" domain={[0, "dataMax"]} />
          <Tooltip cursor={{ fill: "#F0F0F0" }} />
          <Legend
            verticalAlign="top"
            onClick={toggleColumns}
            onMouseLeave={(e) => setColumnsHover(null)}
            onMouseEnter={(e) => setColumnsHover(e.dataKey)}
          />
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
      {props.summaryBelow && (
        <p className="margin-left-1 margin-top-3 margin-bottom-0">
          {props.summary}
        </p>
      )}
    </div>
  );
};

export default ColumnChartPreview;
