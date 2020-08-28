import React from "react";
import {
  XAxis,
  YAxis,
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Props = {
  title: string;
  lines: Array<string>;
  data?: Array<object>;
};

const getRandomColor = () =>
  `#${Math.floor(Math.random() * 65535)
    .toString(16)
    .padStart(6, "0")}`;

const LineChartPreview = (props: Props) => {
  return (
    <div className="text-center">
      <h3>{props.title}</h3>
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
                stroke={getRandomColor()}
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
