import DashboardRepository from "performance-dashboard-backend/src/lib/repositories/dashboard-repo";
import DatasetRepository from "performance-dashboard-backend/src/lib/repositories/dataset-repo";
import { DashboardSnapshot } from "../common";
import { env } from "../env";
import { S3 } from "aws-sdk";

const fs = require("fs-extra");

export const downloadResource = async function (name: string, file: string) {
  const folder = `${__dirname}/../../resources/${name}`;
  fs.ensureDirSync(folder);

  const s3 = new S3();
  let readStream = s3
    .getObject({
      Bucket: env.DATASETS_BUCKET,
      Key: `public/${file}`,
    })
    .createReadStream();

  let writeStream = fs.createWriteStream(`${folder}/${file}`);
  return new Promise((resolve, reject) =>
    readStream
      .pipe(writeStream)
      .on("finish", resolve)
      .on("error", reject)
      .on("close", () => {
        console.log(`Downloaded ${file}`);
      })
  );
};

export const writeSnapshot = function (
  name: string,
  snapshot: DashboardSnapshot
) {
  fs.writeFileSync(
    `${__dirname}/../examples/${name}.json`,
    JSON.stringify(snapshot),
    "utf8"
  );
};

export async function exportDashboard(name: string, dashboardId: string) {
  console.log("exporting dashboard: {}", dashboardId);
  const snapshot: DashboardSnapshot = {
    dashboard: await DashboardRepository.getInstance().getDashboardWithWidgets(
      dashboardId
    ),
    datasets: [],
  };

  if (!snapshot.dashboard) {
    throw new Error(`Dashboard ${dashboardId} not found`);
  }

  console.log("sorting widgets");
  if (!snapshot.dashboard.widgets) {
    snapshot.dashboard.widgets = [];
  }
  snapshot.dashboard.widgets = snapshot.dashboard.widgets?.sort((a, b) => {
    return a.order < b.order ? -1 : a.order > b.order ? 1 : 0;
  });

  for (const widget of snapshot.dashboard.widgets) {
    if (!widget.content?.datasetId) {
      console.log("widget don't have dataset: {}", widget.id);
      continue;
    }

    console.log("exporting dataset: {}", widget.content?.datasetId);
    const dataset = await DatasetRepository.getInstance().getDatasetById(
      widget.content.datasetId
    );
    if (!dataset) {
      throw new Error(`Dataset ${widget.content.datasetId} not found`);
    }

    if (widget.content?.s3Key?.json) {
      console.log("exporting resource: {}", widget.content.s3Key.json);
      await downloadResource(name, widget.content.s3Key.json);
    }
    if (
      widget.content?.s3Key?.raw &&
      widget.content.s3Key.yaw !== widget.content?.s3Key?.json
    ) {
      console.log("exporting resource: {}", widget.content.s3Key.raw);
      await downloadResource(name, widget.content.s3Key.raw);
    }

    snapshot.datasets.push(dataset);
  }

  snapshot.dashboard.parentDashboardId = snapshot.dashboard.id;
  snapshot.dashboard.version = 1;
  writeSnapshot(name, snapshot);
  return snapshot;
}
