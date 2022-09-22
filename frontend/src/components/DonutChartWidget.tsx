import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
  Legend,
  Tooltip,
  Label,
} from "recharts";
import { useColors, useWindowSize } from "../hooks";
import TickFormatter from "../services/TickFormatter";
import MarkdownRender from "./MarkdownRender";
import DataTable from "./DataTable";
import { ColumnMetadata, NumberDataType } from "../models";
import RenderLegendText from "./Legend";

type Props = {
  title: string;
  downloadTitle: string;
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
  showTotal?: boolean;
  isPreview?: boolean;
  showMobilePreview?: boolean;
  computePercentages?: boolean;
};

const DonutChartWidget = (props: Props) => {
  const [partsHover, setPartsHover] = useState<string | null>(null);
  const [hiddenParts, setHiddenParts] = useState<Array<string>>([]);
  const [xAxisLargestValue, setXAxisLargestValue] = useState(0);

  const donutData = useRef<Array<object>>([]);
  const donutParts = useRef<Array<string>>([]);
  let total = useRef<number>(0);

  const { data, parts, showMobilePreview } = props;
  useMemo(() => {
    if (data && data.length) {
      let donut = {};
      total.current = 0;
      donutParts.current = [];
      donutData.current = [];
      let maxTick = -Infinity;
      for (let i = 0; i < data.length; i++) {
        const key = data[i][parts[0] as keyof object];
        const value = data[i][parts[1] as keyof object];
        const barKey = `${key}`;
        donut = {
          ...donut,
          [barKey]: value,
        };
        donutData.current.push({ name: barKey, value: Number(value) });
        donutParts.current.push(barKey);
        if (hiddenParts.includes(barKey)) {
          continue;
        }
        total.current += isNaN(value) ? 0 : Number(value);
        maxTick = Math.max(maxTick, value);
      }
      setXAxisLargestValue(maxTick);
    }
  }, [data, parts, donutData, donutParts, hiddenParts]);

  const colors = useColors(
    donutParts.current.length,
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

  const getTotal = useCallback(() => {
    let columnMetadata;
    if (parts && parts.length > 1 && props.columnsMetadata) {
      columnMetadata = props.columnsMetadata.find(
        (cm) => cm.columnName === parts[1]
      );
    }

    return TickFormatter.format(
      Number(total.current),
      xAxisLargestValue,
      props.significantDigitLabels,
      "",
      "",
      columnMetadata
    );
  }, [
    props.columnsMetadata,
    parts,
    props.significantDigitLabels,
    xAxisLargestValue,
  ]);

  const displayedAmount = (
    value: Number | String,
    columnMetadata: ColumnMetadata
  ): string => {
    const displayedAmount = TickFormatter.format(
      Number(value),
      xAxisLargestValue,
      props.significantDigitLabels,
      "",
      "",
      columnMetadata
    );
    const computedPercentage =
      Math.round((Number(value) / total.current) * 100 * 100) / 100;
    const displayedPercentage = TickFormatter.format(
      computedPercentage,
      xAxisLargestValue,
      false,
      NumberDataType.Percentage,
      ""
    );
    return props.computePercentages
      ? `${displayedAmount} (${displayedPercentage})`
      : displayedAmount;
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
          {displayedAmount(payload.value, columnMetadata)}
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

  const renderLegendText = (value: string, entry: any) => {
    let columnMetadata;
    if (parts && parts.length > 1 && props.columnsMetadata) {
      columnMetadata = props.columnsMetadata.find(
        (cm) => cm.columnName === parts[1]
      );
    }

    return (
      <span>
        <span className="margin-left-05 font-sans-md text-bottom">
          {RenderLegendText(value.toLocaleString(), entry)}
        </span>
        <div className="margin-left-4 margin-bottom-1 text-base-darker text-bold">
          {value && value !== "null" ? (
            TickFormatter.format(
              Number(
                (donutData.current.find((d: any) => d.name === value) as any)
                  .value
              ),
              xAxisLargestValue,
              props.significantDigitLabels,
              "",
              "",
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
    const baseHeight = 300;
    const pixelsByPart = 60;
    const pixelsByPartInPreview = 50;
    const labelsPerRow = 4;
    const labelsPerRowInPreview = 2;

    if (!data || !data.length) {
      return baseHeight;
    }

    let additional;
    if (windowSize.width <= smallScreenPixels || showMobilePreview) {
      additional = data.length * pixelsByPart;
    } else if (props.isPreview) {
      additional =
        (Math.floor(data.length / labelsPerRowInPreview) + 1) *
        pixelsByPartInPreview;
    } else {
      additional = (Math.floor(data.length / labelsPerRow) + 1) * pixelsByPart;
    }
    return baseHeight + additional;
  };

  return (
    <div aria-label={props.title} tabIndex={-1}>
      <h2 className={`margin-bottom-${props.summaryBelow ? "4" : "1"}`}>
        {props.title}
      </h2>
      {!props.summaryBelow && (
        <MarkdownRender
          source={props.summary}
          className="usa-prose margin-top-1 margin-bottom-4 chartSummaryAbove textOrSummary"
        />
      )}
      {donutData.current.length && (
        <div aria-hidden="true">
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
                layout={
                  windowSize.width <= smallScreenPixels || showMobilePreview
                    ? "vertical"
                    : undefined
                }
              />
              <Pie
                data={donutData.current.map((d: any) => {
                  return !hiddenParts.includes(d.name)
                    ? d
                    : { name: d.name, value: 0 };
                })}
                dataKey="value"
                nameKey="name"
                cx={
                  props.isPreview ||
                  windowSize.width <= smallScreenPixels ||
                  showMobilePreview
                    ? "50%"
                    : "28%"
                }
                cy="50%"
                outerRadius={120}
                innerRadius={80}
                label={renderCustomizedLabel}
                labelLine={renderCustomizedLine}
                isAnimationActive={false}
              >
                {donutParts.current.map((part: string, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={!hiddenParts.includes(part) ? colors[index] : "#ccc"}
                    fillOpacity={getOpacity(part)}
                    onMouseLeave={() => setPartsHover(null)}
                    onMouseEnter={() => setPartsHover(part)}
                  />
                ))}
                {props.showTotal && (
                  <Label
                    className="text-base-darker text-bold"
                    value={getTotal()}
                    offset={0}
                    position="center"
                  />
                )}
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
                  return displayedAmount(value, columnMetadata);
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      <div>
        <DataTable
          rows={data || []}
          columns={parts}
          fileName={props.downloadTitle}
          columnsMetadata={props.columnsMetadata}
          showMobilePreview={showMobilePreview}
        />
      </div>
      {props.summaryBelow && (
        <div>
          <MarkdownRender
            source={props.summary}
            className="usa-prose margin-top-1 margin-bottom-0 chartSummaryBelow textOrSummary"
          />
        </div>
      )}
    </div>
  );
};

export default DonutChartWidget;
