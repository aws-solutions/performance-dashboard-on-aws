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
import {NumberDataType} from "../models/index";

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

  const { data, parts, showMobilePreview} = props;
  const computePercentages = props.computePercentages === true;

  let valueSum = 0;
  if(data!==null && data!==undefined){
    data.forEach((ele) => {
      return  valueSum += Number(ele[parts[1] as keyof object]);
    });
  }else{
    valueSum = 1
  }

 

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
        const computedPercentage = (Number(value)/valueSum) * 100;
        const barKey = `${key}`;
        pie = {
          ...pie,
          [barKey]: value,
        };
        pieData.current.push({ name: barKey, value: Number(value), total: valueSum, computedPercentage: computedPercentage });
        pieParts.current.push(barKey);
        if (hiddenParts.includes(barKey)) {
          continue;
        }
        total.current += isNaN(value) ? 0 : Number(value);
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

    let displayValue = Number(payload.value);

    if(computePercentages){
      displayValue = payload.computedPercentage;
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
            displayValue,
            xAxisLargestValue,
            props.significantDigitLabels,
            columnMetadata,
            computePercentages ? NumberDataType.Percentage : undefined
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

  const renderLegendText = (dataKey: string) => {
    let columnMetadata;
    if (parts && parts.length > 1 && props.columnsMetadata) {
      columnMetadata = props.columnsMetadata.find(
        (cm) => cm.columnName === parts[1]
      );
    }

    let value = 0;

    if(dataKey && dataKey !== "null"){
      let pieDatum = (pieData.current.find((d: any) => d.name === dataKey) as any);

      value = computePercentages ? pieDatum.computedPercentage: Number(pieDatum.value);
    }
    return (
      <span>
        <span className="margin-left-05 font-sans-md text-bottom">
          {dataKey.toLocaleString()}
        </span>
        <div className="margin-left-4 margin-bottom-1 text-base-darkest text-bold">
          {dataKey && dataKey !== "null" ? (   
            TickFormatter.format(value,
              xAxisLargestValue,
              props.significantDigitLabels,
              columnMetadata,
              computePercentages ? NumberDataType.Percentage : undefined
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
              layout={
                windowSize.width <= smallScreenPixels || showMobilePreview
                  ? "vertical"
                  : undefined
              }
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
                windowSize.width <= smallScreenPixels ||
                showMobilePreview
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
              formatter={(dataValue: Number | String, dataName: any) => {
                // Check if there is metadata for this column
                let columnMetadata;
                let pieDatum;
                if (parts && parts.length > 1 && props.columnsMetadata) {
                  columnMetadata = props.columnsMetadata.find(
                    (cm) => cm.columnName === dataName
                  );

                  pieDatum = pieData.current.find(
                    (pd) => {
                      console.log(pd)
                      return pd.name === dataName
                    }
                  );
                }
                let amount = TickFormatter.format(
                  dataValue,
                  xAxisLargestValue,
                  props.significantDigitLabels,
                  columnMetadata
                );

                if(!computePercentages) return amount;

                let percent = TickFormatter.format(pieDatum.computedPercentage,
                  xAxisLargestValue,
                  props.significantDigitLabels,
                  columnMetadata,
                  NumberDataType.Percentage
                );

                return `${amount} (${percent})`;

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

export default PieChartWidget;
