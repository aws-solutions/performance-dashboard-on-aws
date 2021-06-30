import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import { useColors } from "../hooks";
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
  hideDataLabels?: boolean;
  isPreview?: boolean;
};

const PieChartWidget = (props: Props) => {
  const [partsHover, setPartsHover] = useState(null);
  const [hiddenParts, setHiddenParts] = useState<Array<string>>([]);
  const [xAxisLargestValue, setXAxisLargestValue] = useState(0);

  const pieData = useRef<Array<object>>([]);
  const pieParts = useRef<Array<string>>([]);
  let total = useRef<number>(0);

  const { data, parts } = props;
  useMemo(() => {
    if (data && data.length) {
      let pie = {};
      total.current = 0;
      pieParts.current = [];
      pieData.current = [];
      let maxTick = -Infinity;
      for (let i = 0; i < data.length; i++) {
        const key = data[i][parts[0] as keyof object];
        const value = data[i][parts[1] as keyof object];
        const barKey = `${key}`;
        pie = {
          ...pie,
          [barKey]: value,
        };
        pieData.current.push({ name: barKey, value });
        pieParts.current.push(barKey);
        if (hiddenParts.includes(barKey)) {
          continue;
        }
        total.current += isNaN(value) ? 0 : value;
        maxTick = Math.max(maxTick, value);
      }
      setXAxisLargestValue(maxTick);
    }
  }, [data, parts, pieData, pieParts, hiddenParts]);

  const colors = useColors(
    pieParts.current.length,
    props.colors?.primary,
    props.colors?.secondary
  );

  const getOpacity = useCallback(
    (dataKey) => {
      if (!partsHover) {
        return 1;
      }
      return partsHover === dataKey.name ? 1 : 0.2;
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
    return (
      <span>
        <span className="margin-left-05 font-sans-md text-bottom">
          {value.toLocaleString()}
        </span>
        <div className="margin-left-4 margin-bottom-1 text-base-darkest text-bold">
          {value && value !== "null" ? (
            TickFormatter.format(
              Number(
                (pieData.current.filter((d: any) => d.name === value)[0] as any)
                  .value
              ),
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
      {pieData.current.length && (
        <ResponsiveContainer width="100%" height={420}>
          <PieChart>
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
              onMouseEnter={(e: any) => setPartsHover(e.value)}
            />
            <Pie
              data={pieData.current}
              dataKey="value"
              nameKey="name"
              cx={props.isPreview ? "35%" : "20%"}
              cy="50%"
              outerRadius={120}
              label={!props.hideDataLabels}
              isAnimationActive={false}
            >
              {pieData.current.map((part: any, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index]}
                  fillOpacity={getOpacity(part)}
                  onMouseLeave={() => setPartsHover(null)}
                  onMouseEnter={() => setPartsHover(part.name)}
                />
              ))}
            </Pie>
            <Tooltip
              itemStyle={{ color: "#1b1b1b" }}
              isAnimationActive={false}
            />
          </PieChart>
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

export default PieChartWidget;
