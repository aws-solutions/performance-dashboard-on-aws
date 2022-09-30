import React, { useCallback, useState, useRef, useEffect } from "react";
// @ts-ignore
import { CategoricalChartWrapper } from "recharts";
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
import { useColors, useXAxisMetadata } from "../hooks";
import UtilsService, { ComputedDimensions } from "../services/UtilsService";
import TickFormatter from "../services/TickFormatter";
import MarkdownRender from "./MarkdownRender";
import DataTable from "./DataTable";
import RenderLegendText from "./Legend";
import { ColumnDataType } from "../models";
import RulerService from "../services/RulerService";

type Props = {
  title: string;
  downloadTitle: string;
  summary: string;
  bars: Array<string>;
  data?: Array<any>;
  summaryBelow: boolean;
  hideLegend?: boolean;
  significantDigitLabels: boolean;
  colors?: {
    primary: string | undefined;
    secondary: string | undefined;
  };
  columnsMetadata: Array<any>;
  hideDataLabels?: boolean;
  showMobilePreview?: boolean;
  stackedChart?: boolean;
  widgetId?: string;
};

const BarChartWidget = (props: Props) => {
  const chartRef = useRef(null);
  const [barsHover, setBarsHover] = useState(null);
  const [hiddenBars, setHiddenBars] = useState<Array<string>>([]);
  const [chartLoaded, setChartLoaded] = useState(false);
  const [dims, setDims] = useState<ComputedDimensions>({
    labelWidth: 260,
    chartHeight: 500,
  });

  function getChartContainer() {
    const instance = chartRef.current as CategoricalChartWrapper;
    return instance?.container as HTMLElement;
  }

  useEffect(() => {
    setDims(
      UtilsService.calculateBarDimentions(
        getChartContainer(),
        !!props.stackedChart,
        props.bars,
        props.data
      )
    );
  }, [
    chartRef,
    props.showMobilePreview,
    props.bars,
    props.data,
    props.stackedChart,
  ]);

  const { xAxisLargestValue } = useXAxisMetadata(
    chartRef,
    chartLoaded,
    props.significantDigitLabels
  );

  const colors = useColors(
    props.bars.length,
    props.colors?.primary,
    props.colors?.secondary
  );

  const getOpacity = useCallback(
    (dataKey) => {
      if (!barsHover) {
        return 1;
      }
      return barsHover === dataKey ? 1 : 0.2;
    },
    [barsHover]
  );

  const { data, bars, showMobilePreview } = props;

  const columnsMetadataDict = new Map();
  props.columnsMetadata.forEach((el) =>
    columnsMetadataDict.set(el.columnName, el)
  );

  const yAxisType = useCallback(() => {
    let columnMetadata;
    if (props.columnsMetadata && bars.length) {
      columnMetadata = props.columnsMetadata.find(
        (cm) => cm.columnName === bars[0]
      );
    }
    if (columnMetadata && columnMetadata.dataType === ColumnDataType.Text) {
      return "category";
    } else {
      return data && data.every((row) => typeof row[bars[0]] === "number")
        ? "number"
        : "category";
    }
  }, [data, bars, props.columnsMetadata]);

  const toggleBars = (e: any) => {
    if (hiddenBars.includes(e.dataKey)) {
      const hidden = hiddenBars.filter((bar) => bar !== e.dataKey);
      setHiddenBars(hidden);
    } else {
      setHiddenBars([...hiddenBars, e.dataKey]);
    }
  };

  const valueAccessor =
    (attribute: string) =>
    ({ payload }: any) => {
      return payload;
    };

  function formatYAxisLabel(label: any) {
    const container = getChartContainer();
    const style = container ? window.getComputedStyle(container) : undefined;
    const width = dims.labelWidth - RulerService.getVisualWidth("M");
    return RulerService.trimToWidth(label, width, style?.font, style?.fontSize);
  }

  return (
    <div aria-label={props.title} tabIndex={-1}>
      <h2 className={`margin-bottom-${props.summaryBelow ? "4" : "1"}`}>
        {props.title}
      </h2>
      {!props.summaryBelow && (
        <MarkdownRender
          source={props.summary}
          className="usa-prose margin-top-0 margin-bottom-4 chartSummaryAbove textOrSummary"
        />
      )}
      {data && data.length && (
        <div aria-hidden="true">
          <ResponsiveContainer
            width="100%"
            height={dims.chartHeight}
            id={`bar-chart-${props.widgetId}`}
          >
            <BarChart
              className="bar-chart"
              data={props.data}
              layout="vertical"
              margin={{ right: 0, left: 0 }}
              ref={(el: CategoricalChartWrapper) => {
                chartRef.current = el;
                setChartLoaded(!!el);
              }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(tick: any) =>
                  TickFormatter.format(
                    Number(tick),
                    xAxisLargestValue,
                    props.significantDigitLabels,
                    "",
                    ""
                  )
                }
              />
              <YAxis
                dataKey={props.bars.length ? props.bars[0] : ""}
                type={yAxisType()}
                width={dims.labelWidth}
                minTickGap={0}
                domain={["dataMin - 1", "dataMax + 1"]}
                scale={yAxisType() === "number" ? "linear" : "auto"}
                tickFormatter={formatYAxisLabel}
                reversed={true}
              />
              <Tooltip
                itemStyle={{ color: "#1b1b1b" }}
                isAnimationActive={false}
                formatter={(value: Number | String, name: string) => {
                  // Check if there is metadata for this column
                  let columnMetadata;
                  if (props.columnsMetadata) {
                    columnMetadata = props.columnsMetadata.find(
                      (cm) => cm.columnName === name
                    );
                  }

                  return TickFormatter.format(
                    Number(value),
                    xAxisLargestValue,
                    props.significantDigitLabels,
                    "",
                    "",
                    columnMetadata
                  );
                }}
              />
              {!props.hideLegend && (
                <Legend
                  verticalAlign="top"
                  onClick={toggleBars}
                  onMouseLeave={() => setBarsHover(null)}
                  onMouseEnter={(e: any) => setBarsHover(e.dataKey)}
                  formatter={RenderLegendText}
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
                      stackId={props.stackedChart ? "a" : `${index}`}
                      isAnimationActive={false}
                    >
                      {!props.hideDataLabels &&
                        props.stackedChart &&
                        index === props.bars.length - 2 && (
                          <LabelList
                            position="right"
                            valueAccessor={valueAccessor(bar)}
                            formatter={(tick: any) => {
                              return TickFormatter.stackedFormat(
                                tick,
                                xAxisLargestValue,
                                props.significantDigitLabels,
                                props.bars.slice(1),
                                props.columnsMetadata
                              );
                            }}
                          />
                        )}
                      {!props.hideDataLabels && !props.stackedChart && (
                        <LabelList
                          dataKey={bar}
                          position="right"
                          formatter={(tick: any) =>
                            TickFormatter.format(
                              Number(tick),
                              xAxisLargestValue,
                              props.significantDigitLabels,
                              "",
                              "",
                              columnsMetadataDict.get(bar)
                            )
                          }
                        />
                      )}
                    </Bar>
                  );
                })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <div>
        <DataTable
          rows={data || []}
          columns={bars}
          columnsMetadata={props.columnsMetadata}
          fileName={props.downloadTitle}
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

export default BarChartWidget;
