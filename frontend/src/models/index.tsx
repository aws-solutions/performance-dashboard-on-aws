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
};

export type Widget = {
  id: string;
  name: string;
  widgetType: string;
  content?: object;
};
