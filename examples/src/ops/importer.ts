import DashboardRepository from "performance-dashboard-backend/src/lib/repositories/dashboard-repo";
import DatasetRepository from "performance-dashboard-backend/src/lib/repositories/dataset-repo";
import { Configuration, DashboardSnapshot } from "../common";
import { v4 as uuidv4 } from "uuid";
import WidgetRepository from "performance-dashboard-backend/src/lib/repositories/widget-repo";
import { S3 } from "aws-sdk";
import { env } from "../env";

const fs = require("fs-extra");

const generateId = (id: string) => {
  if (id.endsWith(".json")) {
    return `${uuidv4()}.json`;
  }
  if (id.endsWith(".csv")) {
    return `${uuidv4()}.csv`;
  }
  return uuidv4();
};

const getOrAdd = (map: Map<string, string>, id: string) => {
  let newId = map.get(id);
  if (!newId) {
    newId = generateId(id);
    map.set(id, newId);
  }
  return newId;
};

const readSnapshot = async function (name: string) {
  const file = `${__dirname}/../examples/${name}.json`;
  const text = fs.readFileSync(file, "utf8");
  return JSON.parse(text) as DashboardSnapshot;
};

const rewriteIds = function (
  snapshot: DashboardSnapshot,
  ids: Map<string, string>,
  config: Configuration
) {
  snapshot = { ...snapshot };

  if (!config.reuseTopicArea) {
    snapshot.dashboard.topicAreaId = getOrAdd(
      ids,
      snapshot.dashboard.topicAreaId
    );
  }

  if (!config.reuseDashboard) {
    snapshot.dashboard.id = getOrAdd(ids, snapshot.dashboard.id);
    snapshot.dashboard.parentDashboardId = getOrAdd(
      ids,
      snapshot.dashboard.parentDashboardId
    );

    if (snapshot.dashboard.tableOfContents) {
      const tableOfContents = new Map<string, boolean>();
      Object.keys(snapshot.dashboard.tableOfContents).forEach((id) => {
        tableOfContents.set(
          getOrAdd(ids, id),
          snapshot.dashboard.tableOfContents[id]
        );
      });
      snapshot.dashboard.tableOfContents = tableOfContents;
    }
  }

  if (snapshot.dashboard.widgets) {
    snapshot.dashboard.widgets.forEach((widget) => {
      if (!config.reuseDashboard) {
        widget.id = getOrAdd(ids, widget.id);
        widget.dashboardId = getOrAdd(ids, widget.dashboardId);

        if (widget.section) {
          widget.section = getOrAdd(ids, widget.section);
        }
        if (widget.content?.widgetIds) {
          widget.content.widgetIds = widget.content.widgetIds.map(
            (id: string) => getOrAdd(ids, id)
          );
        }
      }

      if (!config.reuseDataset) {
        if (widget.content?.datasetId) {
          widget.content.datasetId = getOrAdd(ids, widget.content.datasetId);
        }
        if (widget.content?.s3Key?.json) {
          widget.content.s3Key.json = getOrAdd(ids, widget.content.s3Key.json);
        }
        if (widget.content?.s3Key?.csv) {
          widget.content.s3Key.csv = getOrAdd(ids, widget.content.s3Key.csv);
        }
      }
    });
  }

  if (!config.reuseDataset) {
    snapshot.datasets.forEach((dataset) => {
      dataset.id = getOrAdd(ids, dataset.id);
      if (dataset.s3Key?.json) {
        dataset.s3Key.json = getOrAdd(ids, dataset.s3Key.json);
      }
      if (dataset.s3Key?.raw) {
        dataset.s3Key.raw = getOrAdd(ids, dataset.s3Key.raw);
      }
    });
  }

  snapshot.dashboard.parentDashboardId = snapshot.dashboard.id;
  return snapshot;
};

function copyFile(
  sourceBucket: string,
  sourceFile: string,
  destinationBucket: string,
  destinationFile: string
): Promise<S3.CopyObjectOutput> {
  const s3Client = new S3();
  return new Promise((resolve, reject) => {
    console.log(
      "s3.copyContent call: {}/{} -> {}/{}",
      sourceBucket,
      sourceFile,
      destinationBucket,
      destinationFile
    );
    s3Client.copyObject(
      {
        Bucket: destinationBucket,
        Key: destinationFile,
        CopySource: `${sourceBucket}/${sourceFile}`,
      },
      function (err, data) {
        console.log("s3.copyObject completed");
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
}

export async function importDashboard(config: Configuration) {
  const name = config.example;
  console.log("importing dashboard: {}", name);
  let snapshot = await readSnapshot(name);

  const ids = new Map<string, string>();
  console.log("rewriting ids");
  snapshot = rewriteIds(snapshot, ids, config);
  console.log("id map: {}", ids);

  const original = new Map<string, string>();
  ids.forEach((value, key) => {
    original.set(value, key);
  });

  for (const dataset of snapshot.datasets) {
    console.log("copying resources");
    if (dataset.s3Key?.raw) {
      const originalFile =
        original.get(dataset.s3Key.raw) || dataset.s3Key?.raw;
      await copyFile(
        env.EXAMPLES_BUCKET,
        `${name}/${originalFile}`,
        env.DATASETS_BUCKET,
        `public/${dataset.s3Key.raw}`
      );
    }
    if (dataset.s3Key?.json && dataset.s3Key?.json !== dataset.s3Key.raw) {
      const originalFile =
        original.get(dataset.s3Key.json) || dataset.s3Key?.json;
      await copyFile(
        env.EXAMPLES_BUCKET,
        `${name}/${originalFile}`,
        env.DATASETS_BUCKET,
        `public/${dataset.s3Key.json}`
      );
    }

    dataset.updatedAt = new Date();
    console.log("inserting dataset: {}", dataset);
    await DatasetRepository.getInstance().saveDataset(dataset);
  }

  snapshot.dashboard.updatedAt = new Date();
  console.log("inserting dashboard: {}", snapshot.dashboard);
  await DashboardRepository.getInstance().putDashboard(snapshot.dashboard);

  for (const widget of snapshot.dashboard.widgets || []) {
    console.log("inserting widget: {}", widget);
    widget.updatedAt = new Date();
    await WidgetRepository.getInstance().saveWidget(widget);
  }
  console.log("dashboard created");
  return snapshot;
}
