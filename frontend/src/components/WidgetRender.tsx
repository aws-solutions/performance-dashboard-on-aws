import React from "react";
import { Widget } from "../models";
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

  if (widget.widgetType === "Text") {
    return <TextWidget widget={widget} />;
  }

  const keys =
    widget &&
    widget.content &&
    widget.content.data &&
    widget.content.data.length
      ? (Object.keys(widget.content.data[0]) as Array<string>)
      : [];

  const { content } = widget;
  if (widget.widgetType === "Table") {
    return (
      <TablePreview title={content.title} headers={keys} data={content.data} />
    );
  }

  if (widget.widgetType === "Chart") {
    switch (content.chartType) {
      case "LineChart":
        return (
          <LineChartPreview
            title={content.title}
            lines={keys}
            data={content.data}
          />
        );

      case "ColumnChart":
        return (
          <ColumnChartPreview
            title={content.title}
            columns={keys}
            data={content.data}
          />
        );

      case "BarChart":
        return (
          <BarChartPreview
            title={content.title}
            bars={keys}
            data={content.data}
          />
        );

      case "PartWholeChart":
        return (
          <PartWholeChartPreview
            title={content.title}
            parts={keys}
            data={content.data}
          />
        );
    }
  }

  return null;
}

export default WidgetRender;
