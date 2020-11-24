export type TopicArea = {
  id: string;
  name: string;
  createdBy: string;
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
};

export type PublicDashboard = {
  id: string;
  name: string;
  topicAreaId: string;
  topicAreaName: string;
  description?: string;
  widgets: Array<Widget>;
  updatedAt: Date;
};

export type DashboardVersion = {
  id: string;
  version: number;
  state: DashboardState;
};

export enum WidgetType {
  Text = "Text",
  Chart = "Chart",
  Table = "Table",
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
}

export interface ChartWidget extends Widget {
  content: {
    title: string;
    chartType: ChartType;
    datasetId: string;
    summary: string;
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
    s3Key: {
      raw: string;
      json: string;
    };
  };
}

export type Dataset = {
  id: string;
  fileName: string;
  s3Key: {
    raw: string;
    json: string;
  };
};

export type Homepage = {
  title: string;
  description: string;
  dashboards: Array<PublicDashboard>;
};

// Type for the History object in react-router. Defines the
// location state that is common across all routes.
// Usage in a component: useHistory<LocationState>();
export type LocationState = {
  alert?: {
    type: "success" | "warning" | "info" | "error";
    message: string;
  };
  id?: string;
};
