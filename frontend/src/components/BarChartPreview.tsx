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
import UtilsService from "../services/UtilsService";
import MarkdownRender from "./MarkdownRender";

type Props = {
  title: string;
  summary: string;
  bars: Array<string>;
  data?: Array<any>;
  summaryBelow: boolean;
  hideLegend?: boolean;
  colors?: {
    primary: string | undefined;
    secondary: string | undefined;
  };
};

const BarChartPreview = (props: Props) => {
  const [barsHover, setBarsHover] = useState(null);
  const [hiddenBars, setHiddenBars] = useState<Array<string>>([]);

  const colors = useColors(
    props.bars.length,
    props.colors?.primary,
    props.colors?.secondary
  );

  const pixelsByCharacter = 8;
  const yAxisWidthOffset = 24;
  const yAxisLabelMaxWidth = 220;

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

  const formatYAxisLabel = (label: string) =>
    label.length > 27 ? label.substr(0, 27).concat("...") : label;

  return (
    <div>
      <h2
        className={`margin-left-1 margin-bottom-${
          props.summaryBelow ? "4" : "1"
        }`}
      >
        {props.title}
      </h2>
      {!props.summaryBelow && (
        <MarkdownRender
          source={props.summary}
          className="margin-left-1 margin-top-0 margin-bottom-4 chartSummaryAbove"
        />
      )}
      {data && data.length && (
        <ResponsiveContainer
          width="100%"
          height={data && data.length > 15 ? 600 : 300}
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
                (dataMin: number) => 0,
                (dataMax: number) => dataMax + Math.floor(dataMax * 0.2),
              ]}
              tickFormatter={(tick) => {
                return tick.toLocaleString();
              }}
            />
            <YAxis
              dataKey={props.bars.length ? props.bars[0] : ""}
              type={yAxisType()}
              width={Math.min(
                UtilsService.getLargestHeader(props.bars, props.data) *
                  pixelsByCharacter +
                  yAxisWidthOffset,
                yAxisLabelMaxWidth
              )}
              minTickGap={0}
              domain={["dataMin - 1", "dataMax + 1"]}
              scale={yAxisType() === "number" ? "linear" : "auto"}
              tickFormatter={formatYAxisLabel}
              reversed={true}
            />
            <Tooltip
              cursor={{ fill: "#F0F0F0" }}
              isAnimationActive={false}
              formatter={(value: Number | String) => value.toLocaleString()}
            />
            {!props.hideLegend && (
              <Legend
                verticalAlign="top"
                onClick={toggleBars}
                onMouseLeave={(e) => setBarsHover(null)}
                onMouseEnter={(e) => setBarsHover(e.dataKey)}
              />
            )}
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
                      <LabelList
                        dataKey={bar}
                        position="right"
                        formatter={(value: Number | String) =>
                          value.toLocaleString()
                        }
                      />
                    ) : (
                      ""
                    )}
                  </Bar>
                );
              })}
          </BarChart>
        </ResponsiveContainer>
      )}
      {props.summaryBelow && (
        <MarkdownRender
          source={props.summary}
          className="margin-left-1 margin-top-1 margin-bottom-0 chartSummaryBelow"
        />
      )}
    </div>
  );
};

export default BarChartPreview;
