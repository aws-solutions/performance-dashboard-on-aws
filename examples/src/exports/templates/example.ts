// @ts-nocheck
import {
  Configuration,
  DashboardCollection,
  ExampleBuilder,
} from "../../common";
import { DashboardBuilder } from "../../builders/dashboard-builder";
import { buildTopicAreas } from "./topicareas";
import { createWidgetsBuilder } from "./widgets";

const builder: ExampleBuilder = {
  build: async function build(config: Configuration) {
    const topicAreas = await buildTopicAreas(config);
    const widgetBuilders = await createWidgetsBuilder(config);

    let dashboard = new DashboardBuilder();

    // <GENERATED_CODE>

    return dashboard.build();
  },
};

export default builder;
