import {
  AuditLog,
  AuditLogItem,
  DashboardAuditLog,
  DashboardAuditLogItem,
  ModifiedProperty,
  ItemEvent,
} from "../models/auditlog";
import { Dashboard, DASHBOARD_ITEM_TYPE } from "../models/dashboard";
import DashboardFactory from "./dashboard-factory";

/**
 * Builds an AuditLog dynamodb item that corresponds to the
 * event that happend: Dashboard created, updated or deleted.
 * If the event is Update, the list of modifiedProperties
 * will be populated.
 */
function buildDashboardAuditLogFromEvent(
  event: ItemEvent,
  timestamp: Date,
  dashboard: Dashboard,
  oldDashboard?: Dashboard
): DashboardAuditLogItem {
  let userId = "unknown";
  switch (event) {
    case ItemEvent.Create:
      userId = dashboard.createdBy;
      break;
    case ItemEvent.Update:
      userId = dashboard.updatedBy ?? "unknown";
      break;
    case ItemEvent.Delete:
      userId = dashboard.deletedBy ?? "unknown";
      break;
  }

  const auditLog: DashboardAuditLogItem = {
    pk: DashboardFactory.itemId(dashboard.parentDashboardId),
    sk: timestamp.toISOString(),
    type: DASHBOARD_ITEM_TYPE,
    userId: userId,
    version: dashboard.version,
    event,
  };

  if (event === ItemEvent.Update) {
    auditLog.modifiedProperties = getModifiedProps(oldDashboard, dashboard);
  }

  return auditLog;
}

/**
 * Builds an AuditLog object from a AuditLog dynamodb item. Just like
 * the WidgetFactory.fromItem, this function returns the concrete AuditLog
 * type depending on the item type, i.e. DashboardAuditLogItem for a Dashboard item.
 */
function fromItem(auditLogItem: AuditLogItem): AuditLog | null {
  if (auditLogItem.type === DASHBOARD_ITEM_TYPE) {
    const dashboardAuditLogItem = auditLogItem as DashboardAuditLogItem;
    return {
      itemId: DashboardFactory.dashboardIdFromPk(dashboardAuditLogItem.pk),
      timestamp: new Date(dashboardAuditLogItem.sk),
      event: dashboardAuditLogItem.event,
      userId: dashboardAuditLogItem.userId,
      modifiedProperties: dashboardAuditLogItem.modifiedProperties,
      version: dashboardAuditLogItem.version,
    } as DashboardAuditLog;
  }

  // Item type not recognized, should not happen.
  return null;
}

/**
 * Compares 2 dynamodb items and returns the properties that have changed
 * in the newItem compared to the oldItem.
 */
function getModifiedProps(oldItem: any, newItem: any): ModifiedProperty[] {
  const keys = [...Object.keys(oldItem), ...Object.keys(newItem)];
  const props = new Set<string>(keys);
  const modifiedProps: ModifiedProperty[] = [];

  props.forEach((prop) => {
    if (oldItem[prop] !== newItem[prop]) {
      modifiedProps.push({
        property: prop,
        oldValue: getPropValue(oldItem, prop),
        newValue: getPropValue(newItem, prop),
      });
    }
  });

  return modifiedProps;
}

function getPropValue(item: any, prop: string) {
  if (!item[prop]) return "";
  if (item[prop] instanceof Date) return item[prop].toISOString();
  return item[prop];
}

export default {
  fromItem,
  buildDashboardAuditLogFromEvent,
};
