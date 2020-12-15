import { Widget } from "./widget";

export enum DashboardState {
  Draft = "Draft",
  Published = "Published",
  Archived = "Archived",
  PublishPending = "PublishPending",
  Inactive = "Inactive",
}

export interface DashboardVersion {
  id: string;
  version: number;
  state: DashboardState;
}

export interface Dashboard {
  id: string;
  name: string;
  version: number;
  parentDashboardId: string;
  topicAreaId: string;
  topicAreaName: string;
  description: string;
  createdBy: string;
  updatedAt: Date;
  state: DashboardState;
  releaseNotes?: string;
  widgets?: Array<Widget>;
  friendlyURL?: string;
}

export type DashboardList = Array<Dashboard>;

export interface DashboardItem {
  pk: string;
  sk: string;
  type: string;
  version: number;
  parentDashboardId: string;
  dashboardName: string;
  topicAreaId: string;
  topicAreaName: string;
  description: string;
  createdBy: string;
  updatedAt: string;
  state: string;
  releaseNotes?: string;
  friendlyURL?: string;
}

// Public representation of a dashboard. Hides some fields
// like createdBy and state, which should not be exposed
// on public endpoints.
export interface PublicDashboard {
  id: string;
  name: string;
  topicAreaId: string;
  topicAreaName: string;
  description: string;
  updatedAt: Date;
  widgets?: Array<Widget>;
  friendlyURL?: string;
}
