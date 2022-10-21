import React, { useMemo, useState } from "react";
import { useJsonDataset } from "../hooks";
import { ChartWidget, ChartType } from "../models";
import LineChartWidget from "./LineChartWidget";
import ColumnChartWidget from "./ColumnChartWidget";
import BarChartWidget from "./BarChartWidget";
import PartWholeChartWidget from "./PartWholeChartWidget";
import DatasetParsingService from "../services/DatasetParsingService";
import PieChartWidget from "./PieChartWidget";
import DonutChartWidget from "./DonutChartWidget";
import Utils from "../services/UtilsService";

interface Props {
  widget: ChartWidget;
  showMobilePreview?: boolean;
  hideTitle?: boolean;
}

function ChartWidgetComponent(props: Props) {
  const { content } = props.widget;
  const showMobilePreview = props.showMobilePreview;
  const { json } = useJsonDataset(content.s3Key.json);
  const [filteredJson, setFilteredJson] = useState<Array<any>>([]);

  useMemo(() => {
    let headers = json.length ? Object.keys(json[0]) : [];
    headers = headers.filter((h) => {
      const metadata = content.columnsMetadata
        ? content.columnsMetadata.find((c) => c.columnName === h)
        : undefined;
      return !metadata || !metadata.hidden;
    });

    const newFilteredJson = new Array<any>();
    for (const row of json) {
      const filteredRow = headers.reduce((obj: any, key: any) => {
        obj[key] = row[key];
        return obj;
      }, {});
      if (Object.keys(filteredRow).length > 0) {
        newFilteredJson.push(filteredRow);
      }
    }

    DatasetParsingService.sortFilteredJson(
      newFilteredJson,
      props.widget.content.sortByColumn,
      props.widget.content.sortByDesc
    );
    setFilteredJson(newFilteredJson);
  }, [json, props.widget, content.columnsMetadata]);

  if (!filteredJson || filteredJson.length === 0) {
    return null;
  }

  const keys = Object.keys(filteredJson[0] as Array<string>);
  const chartId = `chart-${Utils.getShorterId(props.widget.id)}`;
  switch (content.chartType) {
    case ChartType.LineChart:
      return (
        <LineChartWidget
          id={chartId}
          title={
            !props.hideTitle && props.widget.showTitle ? content.title : ""
          }
          downloadTitle={content.title}
          summary={content.summary}
          summaryBelow={content.summaryBelow}
          lines={keys}
          data={filteredJson}
          horizontalScroll={content.horizontalScroll}
          significantDigitLabels={content.significantDigitLabels}
          columnsMetadata={content.columnsMetadata}
          showMobilePreview={showMobilePreview}
        />
      );

    case ChartType.ColumnChart:
      return (
        <ColumnChartWidget
          id={chartId}
          title={
            !props.hideTitle && props.widget.showTitle ? content.title : ""
          }
          downloadTitle={content.title}
          summary={content.summary}
          summaryBelow={content.summaryBelow}
          columns={keys}
          data={filteredJson}
          horizontalScroll={content.horizontalScroll}
          stackedChart={content.stackedChart}
          significantDigitLabels={content.significantDigitLabels}
          columnsMetadata={content.columnsMetadata || []}
          hideDataLabels={!content.dataLabels}
          showMobilePreview={showMobilePreview}
        />
      );

    case ChartType.BarChart:
      return (
        <BarChartWidget
          id={chartId}
          title={
            !props.hideTitle && props.widget.showTitle ? content.title : ""
          }
          downloadTitle={content.title}
          summary={content.summary}
          summaryBelow={content.summaryBelow}
          bars={keys}
          data={filteredJson}
          significantDigitLabels={content.significantDigitLabels}
          columnsMetadata={content.columnsMetadata || []}
          hideDataLabels={!content.dataLabels}
          showMobilePreview={showMobilePreview}
          stackedChart={content.stackedChart}
        />
      );

    case ChartType.PartWholeChart:
      return (
        <PartWholeChartWidget
          id={chartId}
          title={
            !props.hideTitle && props.widget.showTitle ? content.title : ""
          }
          downloadTitle={content.title}
          summary={content.summary}
          summaryBelow={content.summaryBelow}
          parts={keys}
          data={filteredJson}
          significantDigitLabels={content.significantDigitLabels}
          showMobilePreview={showMobilePreview}
          columnsMetadata={content.columnsMetadata}
        />
      );

    case ChartType.PieChart:
      return (
        <PieChartWidget
          id={chartId}
          title={
            !props.hideTitle && props.widget.showTitle ? content.title : ""
          }
          downloadTitle={content.title}
          summary={content.summary}
          summaryBelow={content.summaryBelow}
          parts={keys}
          data={filteredJson}
          significantDigitLabels={content.significantDigitLabels}
          hideDataLabels={!content.dataLabels}
          columnsMetadata={content.columnsMetadata}
          computePercentages={content.computePercentages}
          showMobilePreview={showMobilePreview}
        />
      );

    case ChartType.DonutChart:
      return (
        <DonutChartWidget
          id={chartId}
          title={
            !props.hideTitle && props.widget.showTitle ? content.title : ""
          }
          downloadTitle={content.title}
          summary={content.summary}
          summaryBelow={content.summaryBelow}
          parts={keys}
          data={filteredJson}
          significantDigitLabels={content.significantDigitLabels}
          hideDataLabels={!content.dataLabels}
          columnsMetadata={content.columnsMetadata}
          showTotal={content.showTotal}
          computePercentages={content.computePercentages}
          showMobilePreview={showMobilePreview}
        />
      );

    default:
      return null;
  }
}

export default ChartWidgetComponent;
