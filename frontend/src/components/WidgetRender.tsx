import React from "react";
import {
  Widget,
  WidgetType,
  ChartWidget,
  TableWidget,
  ImageWidget,
} from "../models";
import ChartWidgetComponent from "../components/ChartWidget";
import TableWidgetComponent from "../components/TableWidget";
import TextWidget from "../components/TextWidget";
import ImageWidgetComponent from "../components/ImageWidget";

interface Props {
  widget: Widget;
}

function WidgetRender(props: Props) {
  const widget = props.widget;
  switch (widget.widgetType) {
    case WidgetType.Text:
      return <TextWidget widget={widget} />;
    case WidgetType.Chart:
      return <ChartWidgetComponent widget={widget as ChartWidget} />;
    case WidgetType.Table:
      return <TableWidgetComponent widget={widget as TableWidget} />;
    case WidgetType.Image:
      return <ImageWidgetComponent widget={widget as ImageWidget} />;
    default:
      return null;
  }
}

export default WidgetRender;
