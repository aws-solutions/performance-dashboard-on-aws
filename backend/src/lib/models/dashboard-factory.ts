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
    pk: topicareaFactory.itemId(dashboard.topicAreaId),
    sk: itemId(dashboard.id),
    type: DASHBOARD,
    dashboardName: dashboard.name,
    topicAreaName: dashboard.topicAreaName,
    description: dashboard.description,
    createdBy: dashboard.createdBy,
  };
  if (dashboard.overview) {
    item = {...item, overview: dashboard.overview};
  }
  return item;
}

/**
 * Converts a DynamoDB item into a Dashboard object
 */
function fromItem(item: DashboardItem): Dashboard {
  const topicAreaId = item.pk.substring(10);
  const id = item.sk.substring(10);
  let dashboard: Dashboard = {
    id,
    name: item.dashboardName,
    topicAreaId,
    topicAreaName: item.topicAreaName,
    description: item.description,
    createdBy: item.createdBy,
  }
  if (item.overview) {
    dashboard = {...dashboard, overview: item.overview};
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
