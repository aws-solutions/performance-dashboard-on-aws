import React from "react";
import {
  XAxis,
  YAxis,
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useColors } from "../hooks";

type Props = {
  title: string;
  lines: Array<string>;
  data?: Array<object>;
};

const LineChartPreview = (props: Props) => {
  const colors = useColors(props.lines.length);
  return (
    <div>
      <h3 className="margin-left-1">{props.title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={props.data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="xAxis"
            type="category"
            padding={{ left: 20, right: 20 }}
          />
          <YAxis type="number" />
          {props.lines.map((line, index) => {
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
