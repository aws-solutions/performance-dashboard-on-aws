import React from "react";
import {
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useColors } from "../hooks";

type Props = {
  title: string;
  columns: Array<string>;
  data?: Array<object>;
};

const ColumnChartPreview = (props: Props) => {
  const colors = useColors(props.columns.length);
  return (
    <div>
      <h3 className="margin-left-1">{props.title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={props.data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={props.columns.length ? props.columns[0] : ""}
            type="category"
            padding={{ left: 20, right: 20 }}
          />
          <YAxis type="number" />
          <Legend />
          {props.columns.length &&
            props.columns.slice(1).map((column, index) => {
              return <Bar dataKey={column} fill={colors[index]} key={index} />;
            })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ColumnChartPreview;
