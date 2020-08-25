import React from "react";
import {
  XAxis,
  YAxis,
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { xAxis: "Mar.", cd: 0, cc: 10000 },
  { xAxis: "Apr.", cd: 3000, cc: 20000 },
  { xAxis: "May.", cd: 6000, cc: 35000 },
  { xAxis: "Jun.", cd: 12000, cc: 60000 },
  { xAxis: "Jul.", cd: 18000, cc: 90000 },
  { xAxis: "Aug.", cd: 25000, cc: 110000 },
  { xAxis: "Sep.", cd: 27000, cc: 100000 },
  { xAxis: "Oct.", cd: 32000, cc: 85000 },
  { xAxis: "Nov.", cd: 28000, cc: 80000 },
];

type LineProps = {
  name: string;
  color: string;
};

type Props = {
  title: string;
  lines: Array<LineProps>;
  data?: object;
};

const LineChartPreview = (props: Props) => {
  return (
    <div className="text-center">
      <h3>{props.title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="xAxis" padding={{ left: 20, right: 20 }} />
          <YAxis />
          {
            props.lines.length && props.lines.map((line, index) => {
              return (<Line dataKey={line.name} stroke={line.color} key={index} dot={false} strokeWidth="2" />)
            })
          }
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartPreview;
