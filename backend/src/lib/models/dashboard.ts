import { Widget } from "./widget";

export const DASHBOARD_ITEM_TYPE = "Dashboard";

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
  friendlyURL?: string;
}

export interface Dashboard {
  id: string;
  name: string;
  version: number;
  parentDashboardId: string;
  topicAreaId: string;
  topicAreaName: string;
  displayTableOfContents: boolean;
  tableOfContents?: any;
  description: string;
  createdBy: string;
  updatedAt: Date;
  updatedBy?: string;
  submittedBy?: string;
  publishedBy?: string;
  archivedBy?: string;
  deletedBy?: string;
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
  displayTableOfContents: boolean;
  tableOfContents?: any;
  description: string;
  createdBy: string;
  updatedAt: string;
  updatedBy?: string;
  submittedBy?: string;
  publishedBy?: string;
  archivedBy?: string;
  deletedBy?: string;
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
  displayTableOfContents: boolean;
  tableOfContents?: any;
  description: string;
  updatedAt: Date;
  widgets?: Array<Widget>;
  friendlyURL?: string;

  // Filled on a homepage search with dashboard content
  // that matches the search query.
  queryMatches?: Array<string>;
}
