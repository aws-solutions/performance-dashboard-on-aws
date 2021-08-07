export enum WidgetType {
  Text = "Text",
  Chart = "Chart",
  Table = "Table",
  Metrics = "Metrics",
  Image = "Image",
  Section = "Section",
}

export enum ChartType {
  LineChart = "LineChart",
  ColumnChart = "ColumnChart",
  BarChart = "BarChart",
  PartWholeChart = "PartWholeChart",
  PieChart = "PieChart",
  DonutChart = "DonutChart",
}

export enum ColumnDataType {
  Number = "Number",
  Text = "Text",
  Date = "Date",
}

export enum NumberDataType {
  Percentage = "Percentage",
  Currency = "Currency",
  "With thousands separators" = "With thousands separators",
}

export enum CurrencyDataType {
  "Dollar $" = "Dollar $",
  "Euro €" = "Euro €",
  "Pound £" = "Pound £",
}

export interface ColumnMetadata {
  columnName: string;
  dataType?: ColumnDataType;
  numberType?: NumberDataType;
  currencyType?: CurrencyDataType;
  hidden: boolean;
}

export interface Widget {
  id: string;
  name: string;
  widgetType: WidgetType;
  dashboardId: string;
  order: number;
  updatedAt: Date;
  showTitle?: boolean;
  section?: string;
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
  section?: string;
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
    horizontalScroll?: boolean;
    dataLabels: boolean;
    showTotal: boolean;
    fileName: string;
    columnsMetadata: ColumnMetadata[];
    sortByColumn?: string;
    sortByDesc?: boolean;
    significantDigitLabels: boolean;
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
    summaryBelow: boolean;
    datasetType?: string;
    fileName: string;
    columnsMetadata: ColumnMetadata[];
    sortByColumn?: string;
    sortByDesc?: boolean;
    significantDigitLabels: boolean;
    s3Key: {
      raw: string;
      json: string;
    };
  };
}

export interface ImageWidget extends Widget {
  content: {
    title: string;
    imageAltText: string;
    summary?: string;
    summaryBelow: boolean;
    fileName: string;
    s3Key: {
      raw: string;
    };
  };
}

export interface MetricsWidget extends Widget {
  content: {
    title: string;
    datasetId: string;
    oneMetricPerRow: boolean;
    datasetType?: string;
    significantDigitLabels: boolean;
    s3Key: {
      raw: string;
      json: string;
    };
  };
}

export interface SectionWidget extends Widget {
  content: {
    title: string;
    summary?: string;
    summaryBelow: boolean;
    widgetIds?: Array<string>;
    showWithTabs: string;
  };
}
