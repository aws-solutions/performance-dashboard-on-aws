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
import "./PartWholeChartPreview.css";

type Props = {
  title: string;
  summary: string;
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
      total += isNaN(value) ? 0 : value;
    }
    partWholeData.push(bar);
  }

  const colors = useColors(partWholeParts.length);

  const renderLegendText = (value: string) => {
    const index = value.lastIndexOf(" ");
    const label = value.substring(0, index);
    const amount = value.substring(index + 1);
    return (
      <span>
        <span className="margin-left-05 font-sans-md text-bottom">{label}</span>
        <div className="margin-left-4 margin-bottom-2 text-bold">{amount}</div>
      </span>
    );
  };

  return (
    <div>
      <h2 className="margin-left-1 margin-bottom-1">{props.title}</h2>
      <p className="margin-left-1 margin-top-0 margin-bottom-3">
        {props.summary}
      </p>
      {partWholeData.length && (
        <ResponsiveContainer
          width="100%"
          height={props.data && props.data.length > 15 ? 600 : 300}
        >
          <BarChart
            data={partWholeData}
            layout="vertical"
            margin={{ right: -50, left: -50 }}
            maxBarSize={100}
          >
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
              iconSize={24}
              wrapperStyle={{
                top: 0,
                right: 0,
                width: "100%",
              }}
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
      )}
    </div>
  );
};

export default PartWholeChartPreview;
