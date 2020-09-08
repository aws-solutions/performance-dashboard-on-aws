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
  createdBy: string;
};

export type Widget = {
  id: string;
  name: string;
  widgetType: string;
  content?: object;
};

export type Dataset = {
  id: string;
  fileName: string;
  s3Key: {
    raw: string;
    json: string;
  };
};
