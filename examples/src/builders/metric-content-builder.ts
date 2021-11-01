import { Dataset } from "performance-dashboard-backend/src/lib/models/dataset";
import {
  MetricsWidget,
  WidgetType,
} from "performance-dashboard-backend/src/lib/models/widget";
import { WidgetContentBuilder } from "./widget-builder";

export class MetricContentBuilder extends WidgetContentBuilder {
  private title: string | undefined;
  private oneMetricPerRow: boolean | undefined;
  private significantDigitLabels: boolean | undefined;
  private centerAlign: boolean | undefined;
  private dataset: Dataset | undefined;

  constructor() {
    super(WidgetType.Metrics);
  }

  withTitle(title: string) {
    this.title = title;
    return this;
  }

  withOneMetricPerRow(oneMetricPerRow: boolean) {
    this.oneMetricPerRow = oneMetricPerRow;
    return this;
  }

  withSignificantDigitLabels(significantDigitLabels: boolean) {
    this.significantDigitLabels = significantDigitLabels;
    return this;
  }

  withCenterAlign(centerAlign: boolean) {
    this.centerAlign = centerAlign;
    return this;
  }

  withDataset(dataset: Dataset) {
    this.dataset = dataset;
    return this;
  }

  build() {
    if (!this.title) {
      throw new Error("title is required");
    }
    if (!this.dataset) {
      throw new Error("dataset is required");
    }

    const content: MetricsWidget["content"] = {
      title: this.title,
      datasetId: this.dataset.id,
      oneMetricPerRow: this.oneMetricPerRow || false,
      datasetType: "CreateNew",
      significantDigitLabels: this.significantDigitLabels || false,
      metricsCenterAlign: this.centerAlign || false,
      s3Key: this.dataset.s3Key,
    };
    return content;
  }
}
