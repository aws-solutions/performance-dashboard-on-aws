import {
  ChartWidget,
  TextWidget,
  MetricsWidget,
  TableWidget,
  SectionWidget,
} from "performance-dashboard-backend/src/lib/models/widget";

export const writeTextContent = function (content: TextWidget["content"]) {
  return `
    new TextContentBuilder().withText(
      ${"`"}${content.text}${"`"}
      )`;
};
export const writeChartContent = function (content: ChartWidget["content"]) {
  let chart = `
    new ChartContentBuilder()
        .withChartType(ChartType.${content.chartType})
        .withTitle(${"`"}${content.title}${"`"})
        .withSummary(${"`"}${content.summary}${"`"})
        .withSummaryBelow(${content.summaryBelow})
        .withHorizontalScroll(${content.horizontalScroll})
        .withStackedChart(${content.stackedChart})
        .withDataLabels(${content.dataLabels})
        .withComputePercentages(${content.computePercentages})
        .withSortByColumn("${content.sortByColumn}")
        .withSortByDesc(${content.sortByDesc})
        .withDataset(datasets["${content.datasetId}"])
        .withSignificantDigitLabels(${content.significantDigitLabels})
        .withShowTotal(${content.showTotal})`;

  content.columnsMetadata?.forEach((columnMetadata) => {
    chart += `
    .addColumnMetadata(${JSON.stringify(columnMetadata)} as ColumnMetadata)`;
  });

  return chart;
};
export const writeTableContent = function (content: TableWidget["content"]) {
  let table = `
    new TableContentBuilder()
        .withTitle(${"`"}${content.title}${"`"})
        .withSummary(${"`"}${content.summary}${"`"})
        .withSummaryBelow(${content.summaryBelow})
        .withSortByColumn("${content.sortByColumn}")
        .withSortByDesc(${content.sortByDesc})
        .withDataset(datasets["${content.datasetId}"])
        .withSignificantDigitLabels(${content.significantDigitLabels})
        .withDisplayWithPages(${content.displayWithPages})`;

  content.columnsMetadata?.forEach((columnMetadata) => {
    table += `
    .addColumnMetadata(${JSON.stringify(columnMetadata)} as ColumnMetadata)`;
  });

  return table;
};
export const writeMetricsContent = function (
  content: MetricsWidget["content"]
) {
  return `
    new MetricContentBuilder()
        .withTitle(${"`"}${content.title}${"`"})
        .withDataset(datasets["${content.datasetId}"])
        .withSignificantDigitLabels(${content.significantDigitLabels})
        .withCenterAlign(${content.metricsCenterAlign})
        .withOneMetricPerRow(${content.oneMetricPerRow})`;
};
export const writeSectionContent = function (
  content: SectionWidget["content"]
) {
  let section = `
    new SectionContentBuilder()
        .withTitle(${"`"}${content.title}${"`"})
        .withSummary(${"`"}${content.summary}${"`"})
        .withShowWithTabs(${content.showWithTabs})
        .withHorizontally(${content.horizontally})`;

  content.widgetIds?.forEach((widgetId) => {
    section += `
    .addWidget(widgets["${widgetId}"])`;
  });

  return section;
};
