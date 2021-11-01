import { Dataset } from "performance-dashboard-backend/src/lib/models/dataset";
import {
  ColumnMetadata,
  TableWidget,
  WidgetType,
} from "performance-dashboard-backend/src/lib/models/widget";
import { WidgetContentBuilder } from "./widget-builder";

export class TableContentBuilder extends WidgetContentBuilder {
  private title?: string;
  private dataset?: Dataset;
  private summary?: string;
  private summaryBelow?: boolean;
  private sortByColumn?: string;
  private sortByDesc?: boolean;
  private significantDigitLabels?: boolean;
  private displayWithPages?: boolean;
  private columnsMetadata: ColumnMetadata[] = [];

  constructor() {
    super(WidgetType.Table);
  }

  withTitle(title: string) {
    this.title = title;
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

  withDisplayWithPages(displayWithPages: boolean) {
    this.displayWithPages = displayWithPages;
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
    if (!this.dataset) {
      throw new Error("Dataset is required");
    }
    const content: TableWidget["content"] = {
      title: this.title,
      datasetId: this.dataset.id,
      s3Key: this.dataset.s3Key,
      fileName: this.dataset.fileName,
      summary: this.summary,
      summaryBelow: this.summaryBelow || false,
      datasetType: "StaticDataset",
      sortByColumn: this.sortByColumn,
      sortByDesc: this.sortByDesc || false,
      significantDigitLabels: this.significantDigitLabels || false,
      displayWithPages: this.displayWithPages || false,
      columnsMetadata: this.columnsMetadata,
    };
    console.log("content created");
    return content;
  }
}
