import React, { useMemo, useState } from "react";
import { useJsonDataset } from "../hooks";
import { ChartWidget, ChartType } from "../models";
import LineChartWidget from "./LineChartWidget";
import ColumnChartWidget from "./ColumnChartWidget";
import BarChartWidget from "./BarChartWidget";
import PartWholeChartWidget from "./PartWholeChartWidget";

interface Props {
  widget: ChartWidget;
}

function ChartWidgetComponent(props: Props) {
  const { content } = props.widget;
  const { json } = useJsonDataset(content.s3Key.json);
  const [filteredJson, setFilteredJson] = useState<Array<any>>([]);

  useMemo(() => {
    let headers = json.length ? (Object.keys(json[0]) as Array<string>) : [];
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
      if (filteredRow !== {}) {
        newFilteredJson.push(filteredRow);
      }
    }
    setFilteredJson(newFilteredJson);
  }, [json, props.widget]);

  if (!filteredJson || filteredJson.length === 0) {
    return null;
  }

  const keys = Object.keys(filteredJson[0] as Array<string>);
  switch (content.chartType) {
    case ChartType.LineChart:
      return (
        <LineChartWidget
          title={props.widget.showTitle ? content.title : ""}
          summary={content.summary}
          summaryBelow={content.summaryBelow}
          lines={keys}
          data={filteredJson}
          horizontalScroll={content.horizontalScroll}
        />
      );

    case ChartType.ColumnChart:
      return (
        <ColumnChartWidget
          title={props.widget.showTitle ? content.title : ""}
          summary={content.summary}
          summaryBelow={content.summaryBelow}
          columns={keys}
          data={filteredJson}
        />
      );

    case ChartType.BarChart:
      return (
        <BarChartWidget
          title={props.widget.showTitle ? content.title : ""}
          summary={content.summary}
          summaryBelow={content.summaryBelow}
          bars={keys}
          data={filteredJson}
        />
      );

    case ChartType.PartWholeChart:
      return (
        <PartWholeChartWidget
          title={props.widget.showTitle ? content.title : ""}
          summary={content.summary}
          summaryBelow={content.summaryBelow}
          parts={keys}
          data={filteredJson}
        />
      );

    default:
      return null;
  }
}

export default ChartWidgetComponent;
