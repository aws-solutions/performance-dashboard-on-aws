import React from "react";
import {
  XAxis,
  YAxis,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useColors } from "../hooks";

type Props = {
  title: string;
  summary: string;
  lines: Array<string>;
  data?: Array<object>;
};

const LineChartPreview = (props: Props) => {
  const colors = useColors(props.lines.length);
  return (
    <div>
      <h2 className="margin-left-1 margin-bottom-1">{props.title}</h2>
      <p className="margin-left-1 margin-top-0 margin-bottom-3">
        {props.summary}
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={props.data} margin={{ right: 0, left: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={props.lines.length ? props.lines[0] : ""}
            type="category"
            padding={{ left: 20, right: 20 }}
          />
          <YAxis type="number" />
          <Legend />
          {props.lines.length &&
            props.lines.slice(1).map((line, index) => {
              return (
                <Line
                  dataKey={line}
                  stroke={colors[index]}
                  key={index}
                  dot={false}
                  strokeWidth="2"
                />
              );
            })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartPreview;
