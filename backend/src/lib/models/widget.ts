export enum WidgetType {
  Text = "Text",
  Chart = "Chart",
  Table = "Table",
}

export enum ChartType {
  LineChart = "LineChart",
  ColumnChart = "ColumnChart",
  BarChart = "BarChart",
  PartWholeChart = "PartWholeChart",
}

export interface Widget {
  id: string;
  name: string;
  widgetType: WidgetType;
  dashboardId: string;
  order: number;
  updatedAt: Date;
  content: any;
}

export interface WidgetItem {
  pk: string;
  sk: string;
  type: string;
  name: string;
  widgetType: string;
  order: number;
  updatedAt: string;
  content: any;
}

export interface TextWidget extends Widget {
  content: {
    text: string;
  };
}

export interface ChartWidget extends Widget {
  content: {
    title: string;
    chartType: ChartType;
    datasetId: string;
    summary?: string;
    s3Key: {
      raw: string;
      json: string;
    };
  };
}

export interface TableWidget extends Widget {
  content: {
    title: string;
    datasetId: string;
    summary?: string;
    s3Key: {
      raw: string;
      json: string;
    };
  };
}
