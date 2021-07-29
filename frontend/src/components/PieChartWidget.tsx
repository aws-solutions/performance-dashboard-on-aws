import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
  Legend,
  Tooltip,
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
  columnsMetadata: Array<any>;
  hideDataLabels?: boolean;
  isPreview?: boolean;
  showMobilePreview?: boolean;
};

const PieChartWidget = (props: Props) => {
  const [partsHover, setPartsHover] = useState<string | null>(null);
  const [hiddenParts, setHiddenParts] = useState<Array<string>>([]);
  const [xAxisLargestValue, setXAxisLargestValue] = useState(0);

  const pieData = useRef<Array<object>>([]);
  const pieParts = useRef<Array<string>>([]);
  let total = useRef<number>(0);

  const { data, parts, showMobilePreview } = props;
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
      return partsHover === dataKey ? 1 : 0.2;
    },
    [partsHover]
  );

  const toggleParts = (e: any) => {
    if (hiddenParts.includes(e.value)) {
      const hidden = hiddenParts.filter((column) => column !== e.value);
      setHiddenParts(hidden);
    } else {
      setHiddenParts([...hiddenParts, e.value]);
    }
  };

  const renderCustomizedLabel = (properties: any): any => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, payload, fill, midAngle, outerRadius } = properties;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 12;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    let columnMetadata;
    if (parts && parts.length > 1 && props.columnsMetadata) {
      columnMetadata = props.columnsMetadata.find(
        (cm) => cm.columnName === parts[1]
      );
    }

    return !props.hideDataLabels && !hiddenParts.includes(payload.name) ? (
      <g>
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill={fill}
        >
          {TickFormatter.format(
            Number(payload.value),
            xAxisLargestValue,
            props.significantDigitLabels,
            columnMetadata
          )}
        </text>
      </g>
    ) : (
      ""
    );
  };

  const renderCustomizedLine = (properties: any): any => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, payload, fill, midAngle, outerRadius } = properties;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 12;
    const ey = my;

    return !props.hideDataLabels && !hiddenParts.includes(payload.name) ? (
      <g>
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
      </g>
    ) : (
      ""
    );
  };

  const renderLegendText = (value: string) => {
    let columnMetadata;
    if (parts && parts.length > 1 && props.columnsMetadata) {
      columnMetadata = props.columnsMetadata.find(
        (cm) => cm.columnName === parts[1]
      );
    }

    return (
      <span>
        <span className="margin-left-05 font-sans-md text-bottom">
          {value.toLocaleString()}
        </span>
        <div className="margin-left-4 margin-bottom-1 text-base-darkest text-bold">
          {value && value !== "null" ? (
            TickFormatter.format(
              Number(
                (pieData.current.find((d: any) => d.name === value) as any)
                  .value
              ),
              xAxisLargestValue,
              props.significantDigitLabels,
              columnMetadata
            )
          ) : (
            <br />
          )}
        </div>
      </span>
    );
  };

  const windowSize = useWindowSize();
  const smallScreenPixels = 800;

  const calculateChartHeight = (): number => {
    const baseHeight = 240;
    const pixelsByPart = 60;
    const labelsPerRow = 3;

    if (!data || !data.length) {
      return baseHeight;
    }

    let additional;
    if (windowSize.width <= smallScreenPixels || showMobilePreview) {
      additional = data.length * pixelsByPart;
    } else {
      additional = (Math.floor(data.length / labelsPerRow) + 1) * pixelsByPart;
    }
    return baseHeight + additional;
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
        <ResponsiveContainer width="100%" height={calculateChartHeight()}>
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
              data={pieData.current.map((d: any) => {
                return !hiddenParts.includes(d.name)
                  ? d
                  : { name: d.name, value: 0 };
              })}
              dataKey="value"
              nameKey="name"
              cx={
                props.isPreview ||
                showMobilePreview ||
                windowSize.width <= smallScreenPixels
                  ? "50%"
                  : "28%"
              }
              cy="50%"
              outerRadius={120}
              label={renderCustomizedLabel}
              labelLine={renderCustomizedLine}
              isAnimationActive={false}
            >
              {pieParts.current.map((part: any, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={!hiddenParts.includes(part) ? colors[index] : "#ccc"}
                  fillOpacity={getOpacity(part)}
                  onMouseLeave={() => setPartsHover(null)}
                  onMouseEnter={() => setPartsHover(part)}
                />
              ))}
            </Pie>
            <Tooltip
              itemStyle={{ color: "#1b1b1b" }}
              isAnimationActive={false}
              formatter={(value: Number | String) => {
                // Check if there is metadata for this column
                let columnMetadata;
                if (parts && parts.length > 1 && props.columnsMetadata) {
                  columnMetadata = props.columnsMetadata.find(
                    (cm) => cm.columnName === parts[1]
                  );
                }

                return TickFormatter.format(
                  Number(value),
                  xAxisLargestValue,
                  props.significantDigitLabels,
                  columnMetadata
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
      <div style={showMobilePreview ? { float: "left" } : {}}>
        <DataTable
          rows={data || []}
          columns={parts}
          fileName={props.title}
          columnsMetadata={props.columnsMetadata}
        />
      </div>
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
