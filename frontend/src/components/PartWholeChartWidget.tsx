import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useColors, useWindowSize } from "../hooks";
import TickFormatter from "../services/TickFormatter";
import MarkdownRender from "./MarkdownRender";
import DataTable from "./DataTable";

type Props = {
  title: string;
  summary: string;
  parts: Array<string>;
  data?: Array<object>;
  summaryBelow: boolean;
  significantDigitLabels: boolean;
  colors?: {
    primary: string | undefined;
    secondary: string | undefined;
  };
};

const PartWholeChartWidget = (props: Props) => {
  const [partsHover, setPartsHover] = useState(null);
  const [hiddenParts, setHiddenParts] = useState<Array<string>>([]);
  const [xAxisLargestValue, setXAxisLargestValue] = useState(0);
  const windowSize = useWindowSize();

  const partWholeData = useRef<Array<object>>([]);
  const partWholeParts = useRef<Array<string>>([]);
  let total = useRef<number>(0);

  const { data, parts } = props;
  useMemo(() => {
    if (data && data.length) {
      let bar = {};
      total.current = 0;
      partWholeParts.current = [];
      partWholeData.current = [];
      let maxTick = -Infinity;
      for (let i = 0; i < data.length; i++) {
        const key = data[i][parts[0] as keyof object];
        const value = data[i][parts[1] as keyof object];
        const barKey = `${key} ${value}`;
        bar = {
          ...bar,
          [barKey]: value,
        };
        partWholeParts.current.push(barKey);
        if (hiddenParts.includes(barKey)) {
          continue;
        }
        total.current += isNaN(value) ? 0 : value;
        maxTick = Math.max(maxTick, value);
      }
      partWholeData.current.push(bar);
      setXAxisLargestValue(maxTick);
    }
  }, [data, parts, partWholeData, partWholeParts, hiddenParts]);

  const colors = useColors(
    partWholeParts.current.length,
    props.colors?.primary,
    props.colors?.secondary
  );

  const getOpacity = useCallback(
    (dataKey) => {
      if (!partsHover) {
        return 1;
      }
      return partsHover === dataKey ? 1 : 0.2;
    },
    [partsHover]
  );

  const toggleParts = (e: any) => {
    if (hiddenParts.includes(e.dataKey)) {
      const hidden = hiddenParts.filter((column) => column !== e.dataKey);
      setHiddenParts(hidden);
    } else {
      setHiddenParts([...hiddenParts, e.dataKey]);
    }
  };

  const renderLegendText = (value: string) => {
    const index = value.lastIndexOf(" ");
    const label = value.substring(0, index);
    const amount = value.substring(index + 1);
    return (
      <span>
        <span className="margin-left-05 font-sans-md text-bottom">
          {label.toLocaleString()}
        </span>
        <div className="margin-left-4 margin-bottom-1 text-base-darkest text-bold">
          {amount && amount !== "null" ? (
            TickFormatter.format(
              Number(amount),
              xAxisLargestValue,
              props.significantDigitLabels
            )
          ) : (
            <br />
          )}
        </div>
      </span>
    );
  };

  const calculateChartHeight = (): number => {
    const minHeight = 250;
    const minHeightMobile = 300;
    const maxHeight = 500;
    const pixelsByPart = 20;
    const smallScreenPixels = 800;

    if (!data || !data.length) {
      return minHeight;
    }

    // Handle very small screens where width is less than 300 pixels
    if (windowSize.width <= smallScreenPixels) {
      if (data.length < 5) {
        return minHeightMobile;
      } else {
        // For every part in the chart, add 20 pixels
        const additional = Math.min(maxHeight, data.length * pixelsByPart);
        return minHeightMobile + additional;
      }
    }

    return data.length < 15 ? minHeight : maxHeight;
  };

  return (
    <div>
      <h2 className={`margin-bottom-${props.summaryBelow ? "4" : "1"}`}>
        {props.title}
      </h2>
      {!props.summaryBelow && (
        <MarkdownRender
          source={props.summary}
          className="usa-prose margin-top-1 margin-bottom-4 chartSummaryAbove"
        />
      )}
      {partWholeData.current.length && (
        <ResponsiveContainer width="100%" height={calculateChartHeight()}>
          <BarChart
            className="part-to-whole-chart"
            data={partWholeData.current}
            layout="vertical"
            margin={{ right: -50, left: -50 }}
            barSize={100}
          >
            <CartesianGrid horizontal={false} vertical={false} />
            <XAxis
              tickLine={false}
              domain={[0, "dataMax"]}
              ticks={[0, total.current]}
              axisLine={false}
              interval="preserveStartEnd"
              type="number"
              padding={{ left: 2, right: 2 }}
              tickFormatter={(tick) =>
                TickFormatter.format(
                  Number(tick),
                  xAxisLargestValue,
                  props.significantDigitLabels
                )
              }
            />
            <YAxis
              orientation="left"
              yAxisId="left"
              tick={false}
              tickLine={false}
              type="category"
              padding={{ top: 40 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={false}
              tickLine={false}
              type="category"
              padding={{ top: 40 }}
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
              onClick={toggleParts}
              onMouseLeave={() => setPartsHover(null)}
              onMouseEnter={(e: any) => setPartsHover(e.dataKey)}
            />
            {partWholeParts.current.map((part, index) => {
              return (
                <Bar
                  yAxisId="left"
                  stackId={"a"}
                  dataKey={part}
                  key={index}
                  fill={colors[index]}
                  fillOpacity={getOpacity(part)}
                  stroke="white"
                  strokeWidth={2}
                  hide={hiddenParts.includes(part)}
                  isAnimationActive={false}
                />
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      )}
      <DataTable rows={data || []} columns={parts} fileName={props.title} />
      {props.summaryBelow && (
        <MarkdownRender
          source={props.summary}
          className="usa-prose margin-top-1 margin-bottom-0 chartSummaryBelow"
        />
      )}
    </div>
  );
};

export default PartWholeChartWidget;
