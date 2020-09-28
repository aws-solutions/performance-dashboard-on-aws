export type TopicArea = {
  id: string;
  name: string;
};

export type Dashboard = {
  id: string;
  name: string;
  topicAreaId: string;
  topicAreaName: string;
  description?: string;
  widgets: Array<Widget>;
  updatedAt: Date;
  createdBy: string;
};

export type Widget = {
  id: string;
  name: string;
  widgetType: string;
  order: number;
  updatedAt: Date;
  dashboardId: string;
  content?: any;
};

export type Dataset = {
  id: string;
  fileName: string;
  s3Key: {
    raw: string;
    json: string;
  };
};
