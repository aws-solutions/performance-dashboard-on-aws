import { v4 as uuidv4 } from "uuid";
import { User } from "../models/user";
import TopicareaFactory from "./topicarea-factory";
import WidgetFactory from "./widget-factory";
import { Widget } from "../models/widget";
import {
  Dashboard,
  DashboardItem,
  DashboardState,
  DashboardVersion,
  PublicDashboard,
} from "../models/dashboard";

const DASHBOARD: string = "Dashboard";

function createNew(
  name: string,
  topicAreaId: string,
  topicAreaName: string,
  description: string,
  user: User
): Dashboard {
  const id = uuidv4();
  return {
    id,
    name,
    version: 1,
    parentDashboardId: id,
    topicAreaId,
    topicAreaName,
    description,
    state: DashboardState.Draft,
    createdBy: user.userId,
    updatedAt: new Date(),
  };
}

function createDraftFromDashboard(
  dashboard: Dashboard,
  user: User,
  version: number
): Dashboard {
  const id = uuidv4();

  let widgets: Array<Widget> = [];
  if (dashboard.widgets) {
    // Duplicate all widgets related to this dashboard
    widgets = dashboard.widgets.map((widget) =>
      WidgetFactory.createFromWidget(id, widget)
    );
  }

  return {
    id,
    name: dashboard.name,
    version: version,
    parentDashboardId: dashboard.parentDashboardId,
    topicAreaId: dashboard.topicAreaId,
    topicAreaName: dashboard.topicAreaName,
    description: dashboard.description,
    state: DashboardState.Draft,
    createdBy: user.userId,
    updatedAt: new Date(),
    widgets,
  };
}

/**
 * Converts a Dashboard to a DynamoDB item.
 */
function toItem(dashboard: Dashboard): DashboardItem {
  let item: DashboardItem = {
    pk: itemId(dashboard.id),
    sk: itemId(dashboard.id),
    type: DASHBOARD,
    version: dashboard.version,
    parentDashboardId: dashboard.parentDashboardId,
    dashboardName: dashboard.name,
    topicAreaName: dashboard.topicAreaName,
    topicAreaId: TopicareaFactory.itemId(dashboard.topicAreaId),
    description: dashboard.description,
    state: dashboard.state,
    createdBy: dashboard.createdBy,
    updatedAt: dashboard.updatedAt.toISOString(),
    releaseNotes: dashboard.releaseNotes,
  };
  return item;
}

function fromItem(item: DashboardItem): Dashboard {
  const id = item.pk.substring(10);
  let dashboard: Dashboard = {
    id,
    version: item.version,
    name: item.dashboardName,
    topicAreaId: item.topicAreaId.substring(10),
    topicAreaName: item.topicAreaName,
    description: item.description,
    createdBy: item.createdBy,
    parentDashboardId: item.parentDashboardId,
    updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
    state: (item.state as DashboardState) || DashboardState.Draft,
    releaseNotes: item.releaseNotes,
  };
  return dashboard;
}

function itemId(id: string): string {
  return `${DASHBOARD}#${id}`;
}

function toPublic(dashboard: Dashboard): PublicDashboard {
  return {
    id: dashboard.id,
    name: dashboard.name,
    topicAreaId: dashboard.topicAreaId,
    topicAreaName: dashboard.topicAreaName,
    description: dashboard.description,
    updatedAt: dashboard.updatedAt,
    widgets: dashboard.widgets,
  };
}

function toVersion(dashboard: Dashboard): DashboardVersion {
  return {
    id: dashboard.id,
    version: dashboard.version,
    state: dashboard.state,
  };
}

export default {
  createNew,
  createDraftFromDashboard,
  toItem,
  fromItem,
  itemId,
  toPublic,
  toVersion,
};
