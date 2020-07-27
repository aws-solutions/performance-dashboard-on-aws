export type TopicArea = {
  id: string,
  name: string,
};

export type Dashboard = {
  id: string;
  name: string;
  topicAreaId: string;
  topicAreaName: string;
  description: string;
};