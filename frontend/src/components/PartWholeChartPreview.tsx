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
  parts: Array<string>;
  data?: Array<object>;
};

const PartWholeChartPreview = (props: Props) => {
  const partWholeData: Array<object> = [];
  const partWholeParts: Array<string> = [];
  let total: number = 0;

  if (props.data) {
    let bar = {};
    for (let i = 0; i < props.data.length; i++) {
      const key = props.data[i][props.parts[0] as keyof object];
      const value = props.data[i][props.parts[1] as keyof object];
      const barKey = `${key} ${value}`;
      bar = {
        ...bar,
        [barKey]: value,
      };
      partWholeParts.push(barKey);
      total += value;
    }
    partWholeData.push(bar);
  }

  const colors = useColors(partWholeParts.length);

  const renderLegendText = (value: string) => {
    const index = value.lastIndexOf(" ");
    const label = value.substring(0, index);
    const amount = value.substring(index + 1);
    return (
      <div className="margin-bottom-3">
        <span>{label}</span>
        <span className="margin-left-1 text-bold">{amount}</span>
      </div>
    );
  };

  return (
    <div>
      <h3 className="margin-left-1">{props.title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={partWholeData} layout="vertical">
          <CartesianGrid horizontal={false} vertical={false} />
          <XAxis
            tickLine={false}
            domain={[0, "dataMax"]}
            ticks={[0, total]}
            axisLine={false}
            interval="preserveStartEnd"
            type="number"
          />
          <YAxis
            orientation="left"
            yAxisId="left"
            tick={false}
            tickLine={false}
            type="category"
            padding={{ top: 10, bottom: 10 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={false}
            tickLine={false}
            type="category"
            padding={{ top: 10, bottom: 10 }}
          />
          <Legend
            verticalAlign="top"
            formatter={renderLegendText}
            iconSize={30}
          />
          {partWholeParts.map((part, index) => {
            return (
              <Bar
                yAxisId="left"
                stackId={"a"}
                dataKey={part}
                fill={colors[index]}
                key={index}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PartWholeChartPreview;
