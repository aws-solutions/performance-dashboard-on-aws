import { DashboardAuditLog, DashboardState } from "../models";

/**
 * Given a Dashboard Audit Log, it returns a human-friendly action to display
 * to the user based on the `event` and the `modified properties`.
 *
 * Example: If a Dashboard state changed from Draft to Publish Pending,
 * the action will be "Moved to publish pending". If a dashboard was deleted,
 * the action will be "Deleted version".
 */
function getActionFromDashboardAuditLog({
  event,
  modifiedProperties,
}: DashboardAuditLog): string {
  if (event === "Create") return "Created";
  if (event === "Delete") return "Deleted";
  if (!modifiedProperties || modifiedProperties.length === 0) return "Edited";

  let action = "Edited";
  // Find if there was a state change
  modifiedProperties.forEach((modifiedProp) => {
    if (
      modifiedProp.property === "state" &&
      modifiedProp.oldValue !== modifiedProp.newValue
    ) {
      switch (modifiedProp.newValue) {
        case DashboardState.PublishPending:
          action = "Moved to publish queue";
          break;
        case DashboardState.Published:
          action = "Published";
          break;
        case DashboardState.Archived:
          action = "Archived";
          break;
        case DashboardState.Draft:
          action = "Returned to draft";
          break;
      }
    }
  });

  return action;
}

const AuditLogService = {
  getActionFromDashboardAuditLog,
};

export default AuditLogService;
