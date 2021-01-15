import { v4 as uuidv4 } from "uuid";
import {
  Widget,
  WidgetType,
  WidgetItem,
  TextWidget,
  ChartWidget,
  TableWidget,
  ChartType,
} from "../models/widget";

export const WIDGET_ITEM_TYPE = "Widget";
export const WIDGET_PREFIX = "Widget#";
export const DASHBOARD_PREFIX = "Dashboard#";

type CreateWidgetInfo = {
  name: string;
  dashboardId: string;
  widgetType: WidgetType;
  showTitle?: boolean;
  content: any;
};

function createWidget(widgetInfo: CreateWidgetInfo): Widget {
  const widget: Widget = {
    id: uuidv4(),
    name: widgetInfo.name,
    order: 0,
    updatedAt: new Date(),
    dashboardId: widgetInfo.dashboardId,
    widgetType: widgetInfo.widgetType,
    showTitle: widgetInfo.showTitle,
    content: widgetInfo.content,
  };

  switch (widgetInfo.widgetType) {
    case WidgetType.Text:
      return createTextWidget(widget);
    case WidgetType.Chart:
      return createChartWidget(widget);
    case WidgetType.Table:
      return createTableWidget(widget);
    default:
      throw new Error("Invalid widget type");
  }
}

/**
 * Creates a new Widget based on an existing one.
 */
function createFromWidget(dashboardId: string, widget: Widget): Widget {
  return {
    id: uuidv4(),
    name: widget.name,
    widgetType: widget.widgetType,
    dashboardId, // associate new widget to the given dashboardId
    order: widget.order,
    updatedAt: new Date(),
    showTitle: widget.showTitle,
    content: widget.content,
  };
}

function fromItem(item: WidgetItem): Widget {
  const id = item.sk.substring(WIDGET_PREFIX.length);
  const dashboardId = item.pk.substring(DASHBOARD_PREFIX.length);
  const updatedAt = item.updatedAt ? new Date(item.updatedAt) : new Date();
  const showTitle = item.showTitle !== undefined ? item.showTitle : true;
  const widget: Widget = {
    id,
    dashboardId,
    name: item.name,
    widgetType: item.widgetType as WidgetType,
    order: item.order,
    updatedAt,
    showTitle,
    content: item.content,
  };

  switch (item.widgetType) {
    case WidgetType.Text:
      return widget as TextWidget;
    case WidgetType.Chart:
      return widget as ChartWidget;
    case WidgetType.Table:
      return widget as TableWidget;
    default:
      return widget;
  }
}

function fromItems(items: Array<WidgetItem>): Array<Widget> {
  return items.map((item) => fromItem(item));
}

function toItem(widget: Widget): WidgetItem {
  return {
    pk: itemPk(widget.dashboardId),
    sk: itemSk(widget.id),
    name: widget.name,
    widgetType: widget.widgetType.toString(),
    type: WIDGET_ITEM_TYPE,
    order: widget.order,
    updatedAt: widget.updatedAt?.toISOString(),
    showTitle: widget.showTitle,
    content: widget.content,
  };
}

function createTextWidget(widget: Widget): TextWidget {
  if (!widget.content.text) {
    throw new Error("Text widget must have `content.text` field");
  }

  return {
    ...widget,
    content: {
      text: widget.content.text,
    },
  };
}

function createChartWidget(widget: Widget): ChartWidget {
  if (!widget.content.title) {
    throw new Error("Chart widget must have `content.title` field");
  }

  if (!widget.content.chartType) {
    throw new Error("Chart widget must have `content.chartType` field");
  }

  if (!(widget.content.chartType in ChartType)) {
    throw new Error("Invalid chart type");
  }

  if (!widget.content.datasetId) {
    throw new Error("Chart widget must have `content.datasetId` field");
  }

  if (!widget.content.s3Key) {
    throw new Error("Chart widget must have `content.s3Key` field");
  }

  if (!widget.content.fileName) {
    throw new Error("Chart widget must have `content.fileName` field");
  }

  return {
    ...widget,
    content: {
      title: widget.content.title,
      chartType: widget.content.chartType,
      datasetId: widget.content.datasetId,
      summary: widget.content.summary,
      summaryBelow: widget.content.summaryBelow,
      s3Key: widget.content.s3Key,
      fileName: widget.content.fileName,
      datasetType: widget.content.datasetType,
    },
  };
}

function createTableWidget(widget: Widget): TableWidget {
  if (!widget.content.title) {
    throw new Error("Table widget must have `content.title` field");
  }

  if (!widget.content.datasetId) {
    throw new Error("Table widget must have `content.datasetId` field");
  }

  if (!widget.content.s3Key) {
    throw new Error("Table widget must have `content.s3Key` field");
  }

  if (!widget.content.fileName) {
    throw new Error("Table widget must have `content.fileName` field");
  }

  return {
    ...widget,
    content: {
      title: widget.content.title,
      datasetId: widget.content.datasetId,
      summary: widget.content.summary,
      summaryBelow: widget.content.summaryBelow,
      s3Key: widget.content.s3Key,
      fileName: widget.content.fileName,
      datasetType: widget.content.datasetType,
    },
  };
}

// Returns the PK for a widget item in DynamoDB
function itemPk(dashboardId: string): string {
  return DASHBOARD_PREFIX.concat(dashboardId);
}

// Returns the SK for a widget item in DynamoDB
function itemSk(widgetId: string): string {
  return WIDGET_PREFIX.concat(widgetId);
}

export default {
  createWidget,
  createFromWidget,
  fromItem,
  fromItems,
  toItem,
  itemPk,
  itemSk,
};
