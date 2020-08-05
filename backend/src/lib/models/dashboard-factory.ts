import { v4 as uuidv4 } from "uuid";
import { Dashboard, DashboardItem } from "./dashboard-models";
import { User } from "./user-models";
import topicareaFactory from "./topicarea-factory";

const DASHBOARD: string = 'Dashboard';

function createNew(name: string, topicAreaId: string, topicAreaName: string, user: User): Dashboard {
  return {
    id: uuidv4(),
    name,
    topicAreaId,
    topicAreaName,
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
    overview: dashboard.overview,
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
    overview: item.overview,
    createdBy: item.createdBy,
  }
  return dashboard;
}

function itemId(id: string): string { return `${DASHBOARD}#${id}` }

export default {
  toItem,
  createNew,
  fromItem,
  itemId,
};
