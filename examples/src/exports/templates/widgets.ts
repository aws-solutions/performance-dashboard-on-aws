// @ts-nocheck
import {
  ChartType,
  ColumnDataType,
  NumberDataType,
  ColumnMetadata,
} from "performance-dashboard-backend/src/lib/models/widget";
import { Configuration } from "../../common";
import { WidgetBuilder } from "../../builders/widget-builder";
import { ChartContentBuilder } from "../../builders/chart-content-builder";
import { MetricContentBuilder } from "../../builders/metric-content-builder";
import { SectionContentBuilder } from "../../builders/section-content-builder";
import { TextContentBuilder } from "../../builders/text-content-builder";
import { TableContentBuilder } from "../../builders/table-content-builder";
import { buildDatasets } from "./datasets";

export async function createWidgetsBuilder(config: Configuration) {
  const datasets = await buildDatasets(config);
  const widgets: { [name: string]: WidgetBuilder } = {};

  // <GENERATED_CODE>

  return widgets;
}
