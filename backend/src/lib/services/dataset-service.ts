import { InvalidDatasetContent } from "../errors";
import { DatasetContent } from "../models/dataset";
import { User } from "../models/user";
import { Widget } from "../models/widget";
import DashboardRepository from "../repositories/dashboard-repo";
import WidgetRepository from "../repositories/widget-repo";
import DatasetRepository from "../repositories/dataset-repo";

function parse(dataset: any): DatasetContent {
  // Verify dataset is an Array
  if (Array.isArray(dataset)) {
    // Verify every element in the array is an Object
    const isValid = dataset.every((element) => typeof element === "object");

    if (!isValid) {
      throw new InvalidDatasetContent();
    }

    return dataset;
  }

  throw new InvalidDatasetContent();
}

async function updateDataset(
  datasetId: string,
  newMetadata: any,
  newContent: DatasetContent
) {
  // First, update the dataset in DynamoDB and S3
  const repo = DatasetRepository.getInstance();
  await repo.updateDataset(datasetId, newMetadata, newContent);

  // Fetch all widgets associated to this dataset
  let associatedWidgets: Widget[] = [];
  const widgetRepo = WidgetRepository.getInstance();
  associatedWidgets = await widgetRepo.getAssociatedWidgets(datasetId);

  // Get the dashboards associated to these widgets and update
  // their `updateAt` value to reflect that their datasets have been updated.
  const dashboards = associatedWidgets.map((widget) => widget.dashboardId);
  const uniqueDashboards = new Set(dashboards);
  const dashboardRepo = DashboardRepository.getInstance();

  // Instantiate a system user who will update the dashboards.
  const updatedBy: User = { userId: "ingestapi" };

  for await (const dashboardId of uniqueDashboards) {
    await dashboardRepo.updateAt(dashboardId, updatedBy);
  }
}

export default {
  parse,
  updateDataset,
};
