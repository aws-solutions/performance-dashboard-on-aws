import {
  ChartType,
  ColumnDataType,
  NumberDataType,
} from "performance-dashboard-backend/src/lib/models/widget";
import { Configuration } from "../../common";
import { WidgetBuilder } from "../../builders/widget-builder";
import { ChartContentBuilder } from "../../builders/chart-content-builder";
import { MetricContentBuilder } from "../../builders/metric-content-builder";
import { SectionContentBuilder } from "../../builders/section-content-builder";
import { TextContentBuilder } from "../../builders/text-content-builder";
import { buildDatasets } from "./datasets";
import { TableContentBuilder } from "src/builders/table-content-builder";

export async function createWidgetsBuilder(config: Configuration) {
  const datasets = await buildDatasets(config);
  return {
    // Order 0
    introduction: new WidgetBuilder()
      .withId("cd635c2b-cd45-4b9e-aeb4-fba82d6c44aa")
      .generateIdIf(!config.reuseDashboard)
      .withName("Introduction")
      .withContent(
        new TextContentBuilder().withText(
          'Performance Dashboard on AWS helps your team easily share performance data and stories with key stakeholders and the public. You can share metrics, such as cost per transaction, user satisfaction, digital uptake, and completion rate, or other operational metrics to track and improve your service delivery.\n\n**What can I do with Performance Dashboard on AWS?** \n\nYou can create and share data-driven stories using a variety of content item types, including text, tables, charts, metrics, and images.\n\nContent items can be added individually, duplicated, and rearranged to tell your story. You can also group content items into sections and include a table of contents to organize the display of your dashboard.\n\n**How can I use this example dashboard?**\n\nThis example dashboard is included to help you get started. You can read through this dashboard to see what\'s possible, edit this dashboard to explore how it was built, or duplicate this dashboard to customize its contents. \n\nBeneath each chart, you can also select "Actions" and then "Download" to download and modify the data set. This will help you structure your data for display.\n\nYou are currently reading a text content item, which supports [markdown syntax](/admin/markdown). Continue reading to see how to upload data and display data and other content item types.'
        )
      ),
    // Order 1
    datasetsDescription: new WidgetBuilder()
      .withId("666eb998-b204-4ef9-84b1-0c44ff7d4ab7")
      .generateIdIf(!config.reuseDashboard)
      .withName("Use datasets to create data visualizations")
      .withContent(
        new TextContentBuilder().withText(
          "There are three methods to populate chart or table data visualizations:\n\n**1. Create a new dataset from a file**\n\nUpload a CSV or Excel file to create a new dataset. If you want to use a dataset that has already been uploaded, you can choose “select a static dataset” and browse existing datasets.\n\n**2. Select a static dataset**\n\nThis is a fixed dataset that has to be manually updated to update the data visualization. To update this data, you must make changes to the data on your local device, then upload the new dataset as a CSV or Excel file.\n\n**3. Select a dynamic dataset**\n\nThese datasets update the data visualization automatically as new data is added to the source via the system's available API. Dynamic datasets are useful for visualizing streaming data that is updated frequently and doesn't require manual intervention. Dynamic datasets are not configurable in the interface. More details are available in the [Implementation Guide](https://docs.aws.amazon.com/solutions/latest/performance-dashboard-on-aws/welcome.html)"
        )
      ),
    // Order 2
    digitalTransformationProgress: new WidgetBuilder()
      .withId("3b4640fa-3cf8-498b-86a8-92f7d242ba66")
      .generateIdIf(!config.reuseDashboard)
      .withName("Metrics: Digital transformation progress")
      .withContent(
        new MetricContentBuilder()
          .withTitle("Metrics: Digital transformation progress")
          .withDataset(datasets.digitalTransformationProgress)
      ),
    // Order 3
    lineChart: new WidgetBuilder()
      .withId("cdc423fd-5296-47b5-803d-f4fc1cde50b1")
      .generateIdIf(!config.reuseDashboard)
      .withName("Line chart: User satisfaction by channel")
      .withContent(
        new ChartContentBuilder()
          .withChartType(ChartType.LineChart)
          .withTitle("Line chart: User satisfaction by channel")
          .withSummary(
            "A line chart displays ordered data points that are connected by lines. Line charts are used to show trends over time and may contain multiple lines."
          )
          .withDataset(datasets.userSatisfaction)
          .withShowTotal(true)
      ),
    // Order 4
    barChart: new WidgetBuilder()
      .withId("2556bbd5-f5ac-40cf-b86a-0b21d2e5e66c")
      .generateIdIf(!config.reuseDashboard)
      .withName("Bar chart: Program participation for adult members")
      .withContent(
        new ChartContentBuilder()
          .withChartType(ChartType.BarChart)
          .withTitle("Bar chart: Program participation for adult members")
          .withSummary(
            'A bar chart displays categorical data with horizontal bars that are proportional to the value they represent. Like column charts, bar charts are used to display comparisons across qualitative groups or trends over time; however, bar charts provide more space for data labels and may be easier to view on mobile devices.\n\nThe values for this chart were adjusted to show significant digit labels (thousands). If you select "Actions" and then "Show data table" beneath this chart, you can view the original data values without significant digit labels.\n\n[Example chart description] This chart outlines the number of members who registered or attended programming geared towards adult members. Registrants are those who registered in advance either online or in-person. Attendees are those who participated in the programming.'
          )
          .withDataset(datasets.programParticipation)
          .withSignificantDigitLabels(true)
          .withShowTotal(true)
      ),
    // Order 5
    columnChart: new WidgetBuilder()
      .withId("df5b08c1-c6f9-46f1-a24e-10ad68e5ede6")
      .generateIdIf(!config.reuseDashboard)
      .withName("Column chart: Average class size")
      .withContent(
        new ChartContentBuilder()
          .withChartType(ChartType.ColumnChart)
          .withTitle("Column chart: Average class size")
          .withSummary(
            "A column chart displays categorical data with vertical columns that are proportional to the value they represent. Column charts are used to display comparisons across qualitative groups or trends over time.\n\n[Example chart description] The school district's class size has averaged **21 students** over the last decade. This is just above the state average. More recently, class sizes have trailed the state average."
          )
          .withDataset(datasets.averageClassSize)
          .withShowTotal(true)
      ),
    // Order 6
    section: new WidgetBuilder()
      .withId("e048d81b-e2fd-4ca1-ac51-97df65bd3c55")
      .generateIdIf(!config.reuseDashboard)
      .withName("Sections: Grouping related content items together")
      .withContent(
        new SectionContentBuilder()
          .withTitle("Sections: Grouping related content items together")
          .withSummary(
            "A section arranges content items together within a single dashboard by using larger section headers and optional tabbed displays."
          )
          .withShowWithTabs(true)
          .addWidget(
            // Order 7
            new WidgetBuilder()
              .withId("14e6ab1e-5ddf-4366-b6f1-aa7c37bd669c")
              .generateIdIf(!config.reuseDashboard)
              .withName("Pie chart: Renewable energy")
              .withContent(
                new ChartContentBuilder()
                  .withChartType(ChartType.PieChart)
                  .withTitle("Pie chart: Renewable energy")
                  .withSummary(
                    "A pie chart is a circular graph that shows numerical proportion using slices that are proportional to the quantity they represent. Pie charts are used to show relative comparisons between slices as part of a total value."
                  )
                  .withDataset(datasets.renewableEnergy)
                  .withShowTotal(true)
                  .withSignificantDigitLabels(true)
                  .withSortByColumn("Energy Type")
                  .addColumnMetadata({
                    numberType: NumberDataType.Percentage,
                    hidden: false,
                    columnName: "Percentage",
                    dataType: ColumnDataType.Number,
                  })
              )
          )
          .addWidget(
            // Order 8
            new WidgetBuilder()
              .withId("4a76ecd8-5ef0-4cca-b912-ba9641633190")
              .generateIdIf(!config.reuseDashboard)
              .withName("Donut chart: Devices used to access service")
              .withContent(
                new ChartContentBuilder()
                  .withChartType(ChartType.DonutChart)
                  .withTitle("Donut chart: Devices used to access service")
                  .withSummary(
                    "A donut chart is a circular graph that shows numerical proportion using slices that are proportional to the quantity they represent. Like pie charts, donut charts are used to show relative comparisons between slices as part of a total value; however, the center is removed. \n\n[Example chart description] By the end of 2020, the mobile experience for the booking service accounted for 54% of all users. This marked a year-over-year increase of 11%."
                  )
                  .withDataset(datasets.devicesUsed)
                  .addColumnMetadata({
                    numberType: NumberDataType.Percentage,
                    hidden: false,
                    columnName: "Usage",
                    dataType: ColumnDataType.Number,
                  })
              )
          )
          .addWidget(
            // Order 9
            new WidgetBuilder()
              .withId("f8868b76-0382-4727-90f8-318426083ce4")
              .generateIdIf(!config.reuseDashboard)
              .withName("Part-to-whole chart: Devices used to access service")
              .withContent(
                new ChartContentBuilder()
                  .withChartType(ChartType.PartWholeChart)
                  .withTitle(
                    "Part-to-whole chart: Devices used to access service"
                  )
                  .withSummary(
                    "A part-to-whole chart is a rectangular graph that shows numerical proportion using blocks that have an area proportional to the quantity they represent. Part-to-whole charts are used to show relative comparisons between blocks as part of a total value.\n\nThis part-to-whole chart visualizes the data from the donut chart above it. An option was selected when creating this chart to display the summary below the chart."
                  )
                  .withDataset(datasets.devicesUsed)
                  .withSortByDesc(true)
                  .withSummaryBelow(true)
                  .withShowTotal(true)
              )
          )
      ),
    // Order 10
    table: new WidgetBuilder()
      .withId("9920d557-cefb-4fa4-9019-67a5f65f527d")
      .generateIdIf(!config.reuseDashboard)
      .withName("Table: Most frequent incidents")
      .withContent(
        new TableContentBuilder()
          .withTitle("Table: Most frequent incidents")
          .withSummary(
            "A table arranges data in rows and columns. Tables are used to show clear comparisons of data types across categories.\n\n[Example table description] Below are the top 10 most frequent incidents that the Fire and Rescue Department receives every day. Medical emergencies were the most frequent incident by a significant margin: over twice as many as the second most frequent (falls)."
          )
          .withDataset(datasets.frequentIncidents)
          .withSortByColumn("Incident Total")
          .withSortByDesc(true)
      ),
  };
}
