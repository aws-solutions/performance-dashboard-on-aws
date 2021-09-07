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
import ChartDataFormatter from "../services/ChartDataFormatter";
import MarkdownRender from "./MarkdownRender";
import DataTable from "./DataTable";
import { NumberDataType } from "../models/index";

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
  computePercentages?: boolean;
  showTotal?: boolean;
  isPreview?: boolean;
  showMobilePreview?: boolean;
};

const DonutChartWidget = (props: Props) => {
  const [partsHover, setPartsHover] = useState<string | null>(null);
  const [hiddenParts, setHiddenParts] = useState<Array<string>>([]);
  const [xAxisLargestValue, setXAxisLargestValue] = useState(0);

  const donutData = useRef<Array<object>>([]);
  const donutParts = useRef<Array<string>>([]);
  const donutDataMap = useRef<Map<string, any>>(new Map());
  let total = useRef<number>(0);

  const { data, parts, showMobilePreview } = props;

  const computePercentages = props.computePercentages === true;

  const columnMetaDataMap = new Map();

  props.columnsMetadata.forEach((ele) => {
    columnMetaDataMap.set(ele.columnName, ele);
  });

  const chartData = ChartDataFormatter.donutChart(parts, hiddenParts, data);

  useMemo(() => {
    if (data && data.length) {
      let donut = {};
      total.current = chartData.total;

      donutParts.current = [];
      donutData.current = [];

      setXAxisLargestValue(chartData.maxValue);

      for (
        let i = 0, dataLength = chartData.values.length, item = null;
        i < dataLength && (item = chartData.values[i]);
        i++
      ) {
        const computedPercentage =
          Math.round((item.value / chartData.total) * 100 * 100) / 100;

        donut = {
          ...donut,
          [item.key]: item.value,
        };

        const columnMetadata = columnMetaDataMap.get(item.columnName);

        const displayRaw = TickFormatter.format(
          item.value,
          xAxisLargestValue,
          props.significantDigitLabels,
          columnMetadata
        );

        const displayPercentage = TickFormatter.format(
          computedPercentage,
          xAxisLargestValue,
          false,
          undefined,
          NumberDataType.Percentage
        );

        let datum = {
          name: item.key,
          value: item.value,
          total: chartData.total,
          displayRawValue: displayRaw,
          displayPercentage: `${displayRaw} (${displayPercentage})`,
        };

        donutDataMap.current.set(datum.name, datum);
        donutData.current.push(datum);

        donutParts.current.push(item.key);
      }
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
      columnMetadata
    );
  }, [
    props.columnsMetadata,
    parts,
    props.significantDigitLabels,
    xAxisLargestValue,
  ]);

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

    let displayValue = computePercentages
      ? payload.displayPercentage
      : payload.displayRawValue;

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
          {displayValue}
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

  const renderLegendText = (dataKey: string) => {
    let datum;

    if (dataKey && dataKey !== "null") {
      datum = donutDataMap.current.get(dataKey);
    }

    return (
      <span>
        <span className="margin-left-05 font-sans-md text-bottom">
          {dataKey.toLocaleString()}
        </span>
        <div className="margin-left-4 margin-bottom-1 text-base-darkest text-bold">
          {datum !== undefined && datum !== null ? (
            datum.displayRawValue
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
    <div>
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
                  className="text-base-darkest text-bold"
                  value={getTotal()}
                  offset={0}
                  position="center"
                />
              )}
            </Pie>
            <Tooltip
              itemStyle={{ color: "#1b1b1b" }}
              isAnimationActive={false}
              formatter={(dataValue: Number | String, dataName: any) => {
                let pieDatum = donutDataMap.current.get(dataName);

                if (pieDatum === undefined) return "";
                return computePercentages
                  ? pieDatum.displayPercentage
                  : pieDatum.displayRawValue;
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
        <div style={showMobilePreview ? { clear: "left" } : {}}>
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
