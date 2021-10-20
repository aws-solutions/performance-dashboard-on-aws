import { S3 } from "aws-sdk";

const TOPIC_AREA_FILE = "topicarea.json";
const DASHBOARD_FILE = "dashboard.json";

export class ExampleConfig {
  public readonly example: string;
  public readonly topicAreaS3Key: string;
  public readonly dashboardS3Key: string;
  public readonly widgets: WidgetConfig[];
  constructor(example: string, topicAreaS3Key: string, dashboardS3Key: string) {
    this.example = example;
    this.topicAreaS3Key = topicAreaS3Key;
    this.dashboardS3Key = dashboardS3Key;
    this.widgets = [];
  }
}

export class WidgetConfig {
  public readonly s3Key: string;
  public readonly name: string;
  public readonly datasetS3Key: string;
  public readonly datafileS3Keys: string[];
  constructor(key: string, name: string, dataset: string, datafiles: string[]) {
    this.s3Key = key;
    this.name = name;
    this.datasetS3Key = dataset;
    this.datafileS3Keys = datafiles;
  }
}

function splitFilesByPurpose(s3Contents: S3.Object[]) {
  const s3Keys: {
    datafiles: string[];
    datasets: string[];
    topicAreas: string[];
    widgets: string[];
    dashboards: string[];
  } = {
    datafiles: [],
    datasets: [],
    topicAreas: [],
    widgets: [],
    dashboards: [],
  };

  for (
    let i = 0, dataLength = s3Contents.length, s3Content = null;
    i < dataLength && (s3Content = s3Contents[i]);
    i++
  ) {
    let s3path = s3Content.Key;
    if (!s3path) {
      continue;
    }

    if (s3path.indexOf("/datasets/") !== -1) {
      s3Keys.datasets.push(s3path);
    }

    if (s3path.indexOf("/data/") !== -1) {
      s3Keys.datafiles.push(s3path);
    }

    if (s3path.indexOf("/widgets/") !== -1) {
      s3Keys.widgets.push(s3path);
    }

    if (s3path.endsWith(TOPIC_AREA_FILE)) {
      s3Keys.topicAreas.push(s3path);
    }

    if (s3path.endsWith(DASHBOARD_FILE)) {
      s3Keys.dashboards.push(s3path);
    }
  }

  return s3Keys;
}

const inContext = function (prefix: string, example: string) {
  return function (item: string) {
    if (prefix === undefined || prefix === null)
      return item.indexOf(example) !== -1;

    return item.startsWith(prefix) && item.indexOf(example) !== -1;
  };
};

function getFile(
  list: string[],
  example: string,
  fileName: string,
  prefix: string
) {
  const isInContext = inContext(prefix, example);

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (isInContext(item) && item.endsWith(fileName)) {
      return item;
    }
  }

  return undefined;
}

const getWidgets = function (list: string[], example: string, prefix: string) {
  const isInContext = inContext(prefix, example);
  let returnList: string[] = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (
      isInContext(item) &&
      item.indexOf("/widgets/") !== -1 &&
      item.endsWith(`.json`)
    ) {
      returnList.push(item);
    }
  }

  return returnList;
};

const getDataset = function (
  list: string[],
  example: string,
  key: string,
  prefix: string
) {
  const isInContext = inContext(prefix, example);

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (
      isInContext(item) &&
      item.indexOf("/datasets/") !== -1 &&
      item.endsWith(`${key}.json`)
    ) {
      return item;
    }
  }

  return undefined;
};

const getDatafiles = function (
  list: string[],
  example: string,
  key: string,
  prefix: string
) {
  let returnList: string[] = [];
  const isInContext = inContext(prefix, example);
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (
      isInContext(item) &&
      item.indexOf("/data/") !== -1 &&
      (item.endsWith(`${key}.json`) || item.endsWith(`${key}.csv`))
    ) {
      returnList.push(item);
    }
  }

  return returnList;
};

function buildExamplesFromContents(s3Contents: S3.Object[], prefix: string) {
  const s3Keys = splitFilesByPurpose(s3Contents);

  var exampleMap = new Map<string, ExampleConfig>();

  for (let i = 0; i < s3Keys.dashboards.length; i++) {
    let s3path = s3Keys.dashboards[i];
    if (!s3path) {
      continue;
    }

    let tokens = s3path.replace(prefix, "").split("/");
    let example = tokens[0];
    let topicArea = getFile(
      s3Keys.topicAreas,
      example,
      TOPIC_AREA_FILE,
      prefix
    );

    let exampleConfig = new ExampleConfig(example, topicArea || "", s3path);
    let widgets = getWidgets(s3Keys.widgets, example, prefix);

    for (let i = 0; i < widgets.length; i++) {
      const widget = widgets[i];
      let widgetTokens = widget.replace(prefix, "").split("/");
      let key = widgetTokens[widgetTokens.length - 1].split(".")[0];

      let dataset = getDataset(s3Keys.datasets, example, key, prefix);
      let datafiles = getDatafiles(s3Keys.datafiles, example, key, prefix);

      exampleConfig.widgets.push(
        new WidgetConfig(widget, key, dataset || "", datafiles)
      );
    }

    exampleMap.set(example, exampleConfig);
  }

  return exampleMap;
}

export default {
  buildExamplesFromContents,
};
