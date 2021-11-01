import { Dataset } from "performance-dashboard-backend/src/lib/models/dataset";
import {
  ChartType,
  ChartWidget,
  ColumnMetadata,
  WidgetType,
} from "performance-dashboard-backend/src/lib/models/widget";
import { WidgetContentBuilder } from "./widget-builder";

export class ChartContentBuilder extends WidgetContentBuilder {
  private title?: string;
  private chartType?: ChartType;
  private dataset?: Dataset;
  private summary?: string;
  private summaryBelow?: boolean;
  private horizontalScroll?: boolean;
  private stackedChart?: boolean;
  private dataLabels?: boolean;
  private computePercentages?: boolean;
  private showTotal?: boolean;
  private sortByColumn?: string;
  private sortByDesc?: boolean;
  private significantDigitLabels?: boolean;
  private columnsMetadata: ColumnMetadata[] = [];

  constructor() {
    super(WidgetType.Chart);
  }

  withTitle(title: string) {
    this.title = title;
    return this;
  }

  withChartType(chartType: ChartType) {
    this.chartType = chartType;
    return this;
  }

  withDataset(dataset: Dataset) {
    this.dataset = dataset;
    return this;
  }

  withSummary(summary: string) {
    this.summary = summary;
    return this;
  }

  withSummaryBelow(summaryBelow: boolean) {
    this.summaryBelow = summaryBelow;
    return this;
  }

  withHorizontalScroll(horizontalScroll: boolean) {
    this.horizontalScroll = horizontalScroll;
    return this;
  }

  withStackedChart(stackedChart: boolean) {
    this.stackedChart = stackedChart;
    return this;
  }

  withDataLabels(dataLabels: boolean) {
    this.dataLabels = dataLabels;
    return this;
  }

  withComputePercentages(computePercentages: boolean) {
    this.computePercentages = computePercentages;
    return this;
  }

  withShowTotal(showTotal: boolean) {
    this.showTotal = showTotal;
    return this;
  }

  withSortByColumn(sortByColumn: string) {
    this.sortByColumn = sortByColumn;
    return this;
  }

  withSortByDesc(sortByDesc: boolean) {
    this.sortByDesc = sortByDesc;
    return this;
  }

  withSignificantDigitLabels(significantDigitLabels: boolean) {
    this.significantDigitLabels = significantDigitLabels;
    return this;
  }

  addColumnMetadata(columnMetadata: ColumnMetadata) {
    this.columnsMetadata.push(columnMetadata);
    return this;
  }

  build() {
    console.log("building content: {}", this);
    if (!this.title) {
      throw new Error("Title is required");
    }
    if (!this.chartType) {
      throw new Error("Chart type is required");
    }
    if (!this.dataset) {
      throw new Error("Dataset is required");
    }
    const content: ChartWidget["content"] = {
      title: this.title,
      chartType: this.chartType,
      datasetId: this.dataset.id,
      s3Key: this.dataset.s3Key,
      fileName: this.dataset.fileName,
      summary: this.summary,
      summaryBelow: this.summaryBelow || false,
      datasetType: "StaticDataset",
      horizontalScroll: this.horizontalScroll || false,
      stackedChart: this.stackedChart || false,
      dataLabels: this.dataLabels || false,
      computePercentages: this.computePercentages || false,
      showTotal: this.showTotal || false,
      sortByColumn: this.sortByColumn,
      sortByDesc: this.sortByDesc || false,
      significantDigitLabels: this.significantDigitLabels || false,
      columnsMetadata: this.columnsMetadata,
    };
    console.log("content created");
    return content;
  }
}
