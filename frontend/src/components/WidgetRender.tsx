import React from "react";
import {
  Widget,
  WidgetType,
  ChartWidget,
  TableWidget,
  ImageWidget,
  MetricsWidget,
} from "../models";
import { useWidgetDataset } from "../hooks";
import ChartWidgetComponent from "../components/ChartWidget";
import TableWidgetComponent from "../components/TableWidget";
import TextWidget from "../components/TextWidget";
import ImageWidgetComponent from "../components/ImageWidget";
import MetricsWidgetComponent from "../components/MetricsWidget";

interface Props {
  widget: Widget;
}

function WidgetRender({ widget }: Props) {
  const { json, jsonHeaders } = useWidgetDataset(widget);

  switch (widget.widgetType) {
    case WidgetType.Text:
      return <TextWidget widget={widget} />;
    case WidgetType.Chart:
      return <ChartWidgetComponent widget={widget as ChartWidget} />;
    case WidgetType.Table:
      const tableWidget = widget as TableWidget;
      return (
        <TableWidgetComponent
          title={tableWidget.showTitle ? tableWidget.content.title : ""}
          summary={tableWidget.content.summary}
          headers={jsonHeaders}
          data={json}
          summaryBelow={tableWidget.content.summaryBelow}
        />
      );

    case WidgetType.Image:
      return <ImageWidgetComponent widget={widget as ImageWidget} />;
    case WidgetType.Metrics:
      return <MetricsWidgetComponent widget={widget as MetricsWidget} />;
    default:
      return null;
  }
}

export default WidgetRender;
