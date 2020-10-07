import React from "react";
import { Widget } from "../models";
import { useJsonDataset } from "../hooks";
import LineChartPreview from "../components/LineChartPreview";
import ColumnChartPreview from "../components/ColumnChartPreview";
import BarChartPreview from "../components/BarChartPreview";
import PartWholeChartPreview from "../components/PartWholeChartPreview";
import TablePreview from "../components/TablePreview";
import TextWidget from "../components/TextWidget";

interface Props {
  widget: Widget;
}

function WidgetRender(props: Props) {
  const widget = props.widget;
  switch (widget.widgetType) {
    case "Text":
      return <TextWidget widget={widget} />;
    case "Chart":
      return <WidgetWithDataset widget={widget} />;
    case "Table":
      return <WidgetWithDataset widget={widget} />;
    default:
      return null;
  }
}

function WidgetWithDataset(props: Props) {
  const { content, widgetType } = props.widget;
  const { json } = useJsonDataset(content.s3Key.json);

  if (!json || json.length === 0) {
    return null;
  }

  const keys = Object.keys(json[0] as Array<string>);
  if (widgetType === "Table") {
    return <TablePreview title={content.title} headers={keys} data={json} />;
  }

  if (widgetType === "Chart") {
    switch (content.chartType) {
      case "LineChart":
        return (
          <LineChartPreview title={content.title} lines={keys} data={json} />
        );

      case "ColumnChart":
        return (
          <ColumnChartPreview
            title={content.title}
            columns={keys}
            data={json}
          />
        );

      case "BarChart":
        return (
          <BarChartPreview title={content.title} bars={keys} data={json} />
        );

      case "PartWholeChart":
        return (
          <PartWholeChartPreview
            title={content.title}
            parts={keys}
            data={json}
          />
        );
    }
  }

  return null;
}

export default WidgetRender;
