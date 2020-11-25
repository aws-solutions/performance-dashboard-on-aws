export interface TopicArea {
  id: string;
  name: string;
  createdBy: string;
  dashboardCount?: number;
}

export type TopicAreaList = Array<TopicArea>;

export interface TopicAreaItem {
  pk: string;
  sk: string;
  type: string;
  name: string;
  createdBy: string;
}
