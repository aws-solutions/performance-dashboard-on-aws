import React, { useCallback, useState } from "react";
import {
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Legend,
  LabelList,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useColors } from "../hooks";

type Props = {
  title: string;
  summary: string;
  bars: Array<string>;
  data?: Array<any>;
  summaryBelow: boolean;
};

const BarChartPreview = (props: Props) => {
  const [barsHover, setBarsHover] = useState(null);
  const [hiddenBars, setHiddenBars] = useState<Array<string>>([]);
  const colors = useColors(props.bars.length);

  const getOpacity = useCallback(
    (dataKey) => {
      if (!barsHover) {
        return 1;
      }
      return barsHover === dataKey ? 1 : 0.2;
    },
    [barsHover]
  );

  const { data, bars } = props;
  const yAxisType = useCallback(() => {
    return data && data.every((row) => typeof row[bars[0]] === "number")
      ? "number"
      : "category";
  }, [data, bars]);

  const toggleBars = (e: any) => {
    if (hiddenBars.includes(e.dataKey)) {
      const hidden = hiddenBars.filter((bar) => bar !== e.dataKey);
      setHiddenBars(hidden);
    } else {
      setHiddenBars([...hiddenBars, e.dataKey]);
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
      <ResponsiveContainer
        width="100%"
        height={props.data && props.data.length > 15 ? 600 : 300}
      >
        <BarChart
          data={props.data}
          layout="vertical"
          margin={{ right: 0, left: 0 }}
        >
          <CartesianGrid horizontal={false} />
          <XAxis
            type="number"
            domain={[
              (dataMin) => 0,
              (dataMax) => dataMax + Math.floor(dataMax * 0.1),
            ]}
          />
          <YAxis
            dataKey={props.bars.length ? props.bars[0] : ""}
            type={yAxisType()}
            width={
              (props.data
                ?.map((d) => (d as any)[props.bars.length ? props.bars[0] : ""])
                .map((c) => (c as string).length)
                .reduce((a, b) => (a > b ? a : b), 0) || 0) *
                8 +
              24
            }
            minTickGap={0}
            domain={[0, "dataMax + 1"]}
          />
          <Tooltip cursor={{ fill: "#F0F0F0" }} />
          <Legend
            verticalAlign="top"
            onClick={toggleBars}
            onMouseLeave={(e) => setBarsHover(null)}
            onMouseEnter={(e) => setBarsHover(e.dataKey)}
          />
          {props.bars.length &&
            props.bars.slice(1).map((bar, index) => {
              return (
                <Bar
                  dataKey={bar}
                  fill={colors[index]}
                  key={index}
                  fillOpacity={getOpacity(bar)}
                  hide={hiddenBars.includes(bar)}
                >
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
      {props.summaryBelow && (
        <p className="margin-left-1 margin-top-3 margin-bottom-0">
          {props.summary}
        </p>
      )}
    </div>
  );
};

export default BarChartPreview;
