export enum WidgetType {
  Text = "Text",
  Chart = "Chart",
}

export enum ChartType {
  LineChart = "LineChart",
}

export interface Widget {
  id: string;
  name: string;
  widgetType: WidgetType;
  dashboardId: string;
  content: any;
}

export interface WidgetItem {
  pk: string;
  sk: string;
  type: string;
  name: string;
  widgetType: string;
  content: any;
}

export interface TextWidget extends Widget {
  content: {
    text: string,
  }
}

export interface ChartWidget extends Widget {
  content: {
    title: string,
    chartType: ChartType,
  }
}