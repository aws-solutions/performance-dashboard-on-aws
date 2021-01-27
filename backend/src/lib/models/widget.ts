export enum WidgetType {
  Text = "Text",
  Chart = "Chart",
  Table = "Table",
  Metrics = "Metrics",
  Image = "Image",
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
  showTitle?: boolean;
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
  showTitle?: boolean;
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
    summaryBelow: boolean;
    datasetType?: string;
    s3Key: {
      raw: string;
      json: string;
    };
    fileName: string;
  };
}

export interface TableWidget extends Widget {
  content: {
    title: string;
    datasetId: string;
    summary?: string;
    summaryBelow: boolean;
    datasetType?: string;
    s3Key: {
      raw: string;
      json: string;
    };
    fileName: string;
  };
}

export interface ImageWidget extends Widget {
  content: {
    title: string;
    imageAltText: string;
    summary?: string;
    summaryBelow: boolean;
    s3Key: {
      raw: string;
    };
    fileName: string;
  };
}

export interface MetricsWidget extends Widget {
  content: {
    title: string;
    datasetId: string;
    oneMetricPerRow: boolean;
    s3Key: {
      json: string;
    };
  };
}
