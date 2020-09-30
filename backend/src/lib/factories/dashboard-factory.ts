import { v4 as uuidv4 } from "uuid";
import { User } from "../models/user";
import {
  Dashboard,
  DashboardItem,
  DashboardState,
  PublicDashboard,
} from "../models/dashboard";
import TopicareaFactory from "./topicarea-factory";

const DASHBOARD: string = "Dashboard";

function create(
  id: string,
  name: string,
  topicAreaId: string,
  topicAreaName: string,
  description: string,
  state: string,
  user: User,
  updatedAt?: Date
): Dashboard {
  return {
    id,
    name,
    topicAreaId,
    topicAreaName,
    description,
    state: state as DashboardState,
    createdBy: user.userId,
    updatedAt: updatedAt || new Date(),
  };
}

function createNew(
  name: string,
  topicAreaId: string,
  topicAreaName: string,
  description: string,
  user: User
): Dashboard {
  return {
    id: uuidv4(),
    name,
    topicAreaId,
    topicAreaName,
    description,
    state: DashboardState.Draft,
    createdBy: user.userId,
    updatedAt: new Date(),
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
    dashboardName: dashboard.name,
    topicAreaName: dashboard.topicAreaName,
    topicAreaId: TopicareaFactory.itemId(dashboard.topicAreaId),
    description: dashboard.description,
    state: dashboard.state,
    createdBy: dashboard.createdBy,
    updatedAt: dashboard.updatedAt.toISOString(),
  };
  return item;
}

function fromItem(item: DashboardItem): Dashboard {
  const id = item.pk.substring(10);
  let dashboard: Dashboard = {
    id,
    name: item.dashboardName,
    topicAreaId: item.topicAreaId.substring(10),
    topicAreaName: item.topicAreaName,
    description: item.description,
    createdBy: item.createdBy,
    updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
    state: (item.state as DashboardState) || DashboardState.Draft,
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

export default {
  create,
  createNew,
  toItem,
  fromItem,
  itemId,
  toPublic,
};
