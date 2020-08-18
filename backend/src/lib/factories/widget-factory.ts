import { v4 as uuidv4 } from "uuid";
import { Widget, WidgetType, WidgetItem, TextWidget } from "../models/widget";

const WIDGET_ITEM_TYPE = "Widget";
const WIDGET_PREFIX = "Widget#";
const DASHBOARD_PREFIX = "Dashboard#";

function createWidget(
  name: string,
  dashboardId: string,
  widgetType: WidgetType,
  content: any
): Widget {
  switch (widgetType) {
    case WidgetType.Text:
      return createTextWidget(name, dashboardId, content);
    default:
      throw new Error("Invalid widget type");
  }
}

function fromItem(item: WidgetItem): Widget {
  const id = item.sk.substring(WIDGET_PREFIX.length);
  const dashboardId = item.pk.substring(DASHBOARD_PREFIX.length);
  const widget: Widget = {
    id,
    dashboardId,
    name: item.name,
    widgetType: item.widgetType as WidgetType,
    content: item.content,
  };

  switch (item.widgetType) {
    case WidgetType.Text:
      return widget as TextWidget;
    default:
      return widget;
  }
}

function fromItems(items: Array<WidgetItem>): Array<Widget> {
  return items.map(item => fromItem(item));
}

function toItem(widget: Widget): WidgetItem {
  return {
    pk: DASHBOARD_PREFIX.concat(widget.dashboardId),
    sk: WIDGET_PREFIX.concat(widget.id),
    name: widget.name,
    widgetType: widget.widgetType.toString(),
    type: WIDGET_ITEM_TYPE,
    content: widget.content,
  };
}

function createTextWidget(
  name: string,
  dashboardId: string,
  content: any
): TextWidget {
  return {
    id: uuidv4(),
    name,
    dashboardId,
    widgetType: WidgetType.Text,
    content: {
      text: content.text,
    },
  };
}

export default {
  createWidget,
  fromItem,
  fromItems,
  toItem,
};
