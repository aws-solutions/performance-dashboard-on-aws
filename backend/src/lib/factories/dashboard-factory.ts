import { v4 as uuidv4 } from "uuid";
import { Dashboard, DashboardItem } from "../models/dashboard";
import { User } from "../models/user";
import topicareaFactory from "./topicarea-factory";

const DASHBOARD: string = 'Dashboard';

function create(id: string, name: string, topicAreaId: string, topicAreaName: string, description: string, user: User): Dashboard {
  return {
    id,
    name,
    topicAreaId,
    topicAreaName,
    description,
    createdBy: user.userId,
  };
}

function createNew(name: string, topicAreaId: string, topicAreaName: string, description: string, user: User): Dashboard {
  return {
    id: uuidv4(),
    name,
    topicAreaId,
    topicAreaName,
    description,
    createdBy: user.userId,
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
    topicAreaId: topicareaFactory.itemId(dashboard.topicAreaId),
    description: dashboard.description,
    createdBy: dashboard.createdBy,
  };
  return item;
}

/**
 * Converts a DynamoDB item into a Dashboard object
 */
function fromItem(item: DashboardItem): Dashboard {
  const id = item.pk.substring(10);
  let dashboard: Dashboard = {
    id,
    name: item.dashboardName,
    topicAreaId: item.topicAreaId.substring(10),
    topicAreaName: item.topicAreaName,
    description: item.description,
    createdBy: item.createdBy,
  }
  return dashboard;
}

function itemId(id: string): string { return `${DASHBOARD}#${id}` }

export default {
  create,
  createNew,
  toItem,
  fromItem,
  itemId,
};
