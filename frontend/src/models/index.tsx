export type TopicArea = {
  id: string;
  name: string;
  createdBy: string;
  dashboardCount: number;
};

export type PublicTopicArea = {
  id: string;
  name: string;
  dashboards?: Array<Dashboard | PublicDashboard>;
};

export enum DashboardState {
  Draft = "Draft",
  Published = "Published",
  Archived = "Archived",
  PublishPending = "PublishPending",
}

export enum SourceType {
  IngestApi = "IngestApi",
  FileUpload = "FileUpload",
}

export enum DatasetType {
  DynamicDataset = "DynamicDataset",
  StaticDataset = "StaticDataset",
  CsvFileUpload = "CsvFileUpload",
}

export type Dashboard = {
  id: string;
  name: string;
  version: number;
  parentDashboardId: string;
  topicAreaId: string;
  topicAreaName: string;
  description?: string;
  releaseNotes?: string;
  widgets: Array<Widget>;
  state: string;
  updatedAt: Date;
  createdBy: string;
  friendlyURL?: string;
};

export type PublicDashboard = {
  id: string;
  name: string;
  topicAreaId: string;
  topicAreaName: string;
  description?: string;
  widgets: Array<Widget>;
  updatedAt: Date;
  friendlyURL?: string;
};

export type DashboardVersion = {
  id: string;
  version: number;
  state: DashboardState;
};

export type DashboardAuditLog = {
  itemId: string;
  timestamp: Date;
  version: number;
  userId: string;
  event: "Create" | "Update" | "Delete";
  modifiedProperties?: Array<{
    property: string;
    oldValue: any;
    newValue: any;
  }>;
};

export enum WidgetType {
  Text = "Text",
  Chart = "Chart",
  Table = "Table",
  Image = "Image",
  Metrics = "Metrics",
}

export enum ChartType {
  LineChart = "LineChart",
  ColumnChart = "ColumnChart",
  BarChart = "BarChart",
  PartWholeChart = "PartWholeChart",
}

export interface Widget {
  id: string;
  name: string;
  widgetType: string;
  order: number;
  updatedAt: Date;
  dashboardId: string;
  content: any;
  showTitle: boolean;
}

export interface ChartWidget extends Widget {
  content: {
    title: string;
    chartType: ChartType;
    datasetId: string;
    summary: string;
    summaryBelow: boolean;
    datasetType?: DatasetType;
    s3Key: {
      raw: string;
      json: string;
    };
  };
}

export interface TableWidget extends Widget {
  content: {
    title: string;
    datasetId: string;
    summary: string;
    summaryBelow: boolean;
    datasetType?: DatasetType;
    s3Key: {
      raw: string;
      json: string;
    };
  };
}

export interface ImageWidget extends Widget {
  content: {
    title: string;
    imageAltText: string;
    summary?: string;
    summaryBelow: boolean;
    s3Key: {
      raw: string;
    };
    filename: string;
  };
}

export interface MetricsWidget extends Widget {
  content: {
    title: string;
    datasetId: string;
    oneMetricPerRow: boolean;
    s3Key: {
      raw: string;
      json: string;
    };
  };
}

export enum DatasetSchema {
  None = "None",
  Metrics = "Metrics",
}

export type Dataset = {
  id: string;
  fileName: string;
  s3Key: {
    raw: string;
    json: string;
  };
  createdBy?: string;
  updatedAt?: Date;
  sourceType?: SourceType;
  schema?: DatasetSchema;
};

export type PublicHomepage = {
  title: string;
  description: string;
  dashboards: Array<PublicDashboard>;
};

export type Homepage = {
  title: string;
  description: string;
  updatedAt: Date;
};

export type PublicSettings = {
  dateTimeFormat: {
    date: string;
    time: string;
  };
  navbarTitle?: string;
  topicAreaLabels?: {
    singular: string;
    plural: string;
  };
};

export type Settings = {
  publishingGuidance: string;
  dateTimeFormat: {
    date: string;
    time: string;
  };
  updatedAt?: Date;
  navbarTitle?: string;
  topicAreaLabels: {
    singular: string;
    plural: string;
  };
};

export type Metric = {
  title: string;
  value: number;
  changeOverTime?: string;
  startDate?: string;
  endDate?: string;
};

// Type for the History object in react-router. Defines the
// location state that is common across all routes.
// Usage in a component: useHistory<LocationState>();
export type LocationState = {
  alert?: {
    type: "success" | "warning" | "info" | "error";
    message: string;
    to?: string;
    linkLabel?: string;
  };
  emails?: string;
  id?: string;
  metrics?: Array<Metric>;
  metric?: Metric;
  position?: number;
  showTitle?: boolean;
  oneMetricPerRow?: boolean;
  metricTitle?: string;
  origin?: string;
};

export enum UserRoles {
  Admin = "Admin",
  Editor = "Editor",
  Publisher = "Publisher",
}

export type User = {
  userId: string;
  enabled: boolean;
  userStatus: string;
  sub: string;
  email: string;
  roles: Array<UserRoles>;
  createdAt: Date;
  updatedAt: Date;
};
