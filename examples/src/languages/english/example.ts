import { Configuration, ExampleBuilder } from "../../common";
import { DashboardBuilder } from "../../builders/dashboard-builder";
import { buildTopicAreas } from "./topicareas";
import { createWidgetsBuilder } from "./widgets";

export const englishBuilder: ExampleBuilder = {
  build: async function build(config: Configuration) {
    const topicAreas = await buildTopicAreas(config);
    const widgetBuilders = await createWidgetsBuilder(config);

    const dashboard = await new DashboardBuilder()
      .withId("0bebbfb4-f0a9-4a42-903c-ff33c743baed")
      .generateIdIf(!config.reuseDashboard)
      .withName("Example Dashboard")
      .withAuthor(config.author)
      .withDescription(
        "With Performance Dashboard on AWS, you can rapidly create, maintain, and share your data-driven stories. Add a short description here to introduce this individual dashboard to your audience."
      )
      .withTopicArea(topicAreas.acountability)
      .addWidget(widgetBuilders.introduction)
      .addWidget(widgetBuilders.datasetsDescription)
      .addWidget(widgetBuilders.digitalTransformationProgress)
      .addWidget(widgetBuilders.lineChart)
      .addWidget(widgetBuilders.barChart)
      .addWidget(widgetBuilders.columnChart)
      .addWidget(widgetBuilders.section)
      .addWidget(widgetBuilders.table)
      .build();

    return {
      welcome: dashboard,
    };
  },
};
