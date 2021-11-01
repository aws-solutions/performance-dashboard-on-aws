import DashboardRepository from "performance-dashboard-backend/src/lib/repositories/dashboard-repo";
import DatasetRepository from "performance-dashboard-backend/src/lib/repositories/dataset-repo";
import { writeTopicArea } from "./topicarea-writer";
import { writeDataset } from "./dataset-writer";
import { writeWidget } from "./widget-writer";
import { writeDashboard } from "./dashboard-writer";

const fs = require("fs-extra");

function copyTemplates(name: string) {
  fs.copySync(`${__dirname}/templates`, `${__dirname}/../examples/${name}`);
}

export async function exportExample(name: string, dashboardId: string) {
  copyTemplates(name);

  const dashboard =
    await DashboardRepository.getInstance().getDashboardWithWidgets(
      dashboardId
    );
  dashboard.widgets = dashboard.widgets?.sort((a, b) => {
    return a.order < b.order ? -1 : a.order > b.order ? 1 : 0;
  });

  console.log("exporting dashboard: {}", dashboard);

  writeTopicArea(name, dashboard.topicAreaId, dashboard.topicAreaName);
  writeDashboard(name, dashboard);

  dashboard.widgets?.forEach(async (widget) => {
    if (widget.content?.datasetId) {
      const dataset = await DatasetRepository.getInstance().getDatasetById(
        widget.content.datasetId
      );
      await writeDataset(name, dataset);
    }
    writeWidget(name, widget);
  });
}
