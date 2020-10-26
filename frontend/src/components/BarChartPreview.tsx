import React from "react";
import {
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Legend,
  LabelList,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useColors } from "../hooks";

type Props = {
  title: string;
  bars: Array<string>;
  data?: Array<object>;
};

const BarChartPreview = (props: Props) => {
  const colors = useColors(props.bars.length);
  return (
    <div>
      <h2 className="margin-left-2px">{props.title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={props.data}
          layout="vertical"
          margin={{ right: 0, left: 0 }}
        >
          <CartesianGrid horizontal={false} />
          <XAxis type="number" />
          <YAxis
            dataKey={props.bars.length ? props.bars[0] : ""}
            type="category"
            minTickGap={0}
            padding={{ top: 10, bottom: 10 }}
          />
          <Legend />
          {props.bars.length &&
            props.bars.slice(1).map((bar, index) => {
              return (
                <Bar dataKey={bar} fill={colors[index]} key={index}>
                  {props.bars.length <= 3 ? (
                    <LabelList dataKey={bar} position="right" />
                  ) : (
                    ""
                  )}
                </Bar>
              );
            })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartPreview;
