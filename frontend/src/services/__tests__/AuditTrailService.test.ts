import { DashboardAuditLog } from "../../models";
import AuditTrailService from "../AuditTrailService";

const timestamp = new Date();
const baseAuditLog: DashboardAuditLog = {
  itemId: "001",
  timestamp,
  version: 1,
  userId: "johndoe",
  event: "Delete",
};

describe("getActionFromDashboardAuditLog", () => {
  test("returns `Deleted` when event is Delete", () => {
    const auditLog: DashboardAuditLog = { ...baseAuditLog, event: "Delete" };
    const action = AuditTrailService.getActionFromDashboardAuditLog(auditLog);
    expect(action).toEqual("Deleted");
  });

  test("returns `Created` when event is Create", () => {
    const auditLog: DashboardAuditLog = { ...baseAuditLog, event: "Create" };
    const action = AuditTrailService.getActionFromDashboardAuditLog(auditLog);
    expect(action).toEqual("Created");
  });

  test("returns `Edited` when modifiedProperties are not present", () => {
    const auditLog: DashboardAuditLog = {
      ...baseAuditLog,
      event: "Update",
    };
    const action = AuditTrailService.getActionFromDashboardAuditLog(auditLog);
    expect(action).toEqual("Edited");
  });

  test("returns `Edited` when modifiedProperties are empty", () => {
    const auditLog: DashboardAuditLog = {
      ...baseAuditLog,
      event: "Update",
      modifiedProperties: [],
    };
    const action = AuditTrailService.getActionFromDashboardAuditLog(auditLog);
    expect(action).toEqual("Edited");
  });

  test("returns `Edited` when modifiedProperties are not a state change", () => {
    const auditLog: DashboardAuditLog = {
      ...baseAuditLog,
      event: "Update",
      modifiedProperties: [
        {
          property: "updatedAt",
          newValue: new Date("2021-02-05 20:49").toISOString(),
          oldValue: new Date("2021-02-01 00:03").toISOString(),
        },
      ],
    };
    const action = AuditTrailService.getActionFromDashboardAuditLog(auditLog);
    expect(action).toEqual("Edited");
  });

  test("returns `Moved to publish queue` when state changes to PublishPending", () => {
    const action = AuditTrailService.getActionFromDashboardAuditLog({
      ...baseAuditLog,
      event: "Update",
      modifiedProperties: [
        {
          property: "state",
          oldValue: "Draft",
          newValue: "PublishPending",
        },
      ],
    });
    expect(action).toEqual("Moved to publish queue");
  });

  test("returns `Published` when state changes to Published", () => {
    const action = AuditTrailService.getActionFromDashboardAuditLog({
      ...baseAuditLog,
      event: "Update",
      modifiedProperties: [
        {
          property: "state",
          oldValue: "PublishPending",
          newValue: "Published",
        },
      ],
    });
    expect(action).toEqual("Published");
  });

  test("returns `Archived` when state changes to Archived", () => {
    const action = AuditTrailService.getActionFromDashboardAuditLog({
      ...baseAuditLog,
      event: "Update",
      modifiedProperties: [
        {
          property: "state",
          oldValue: "Published",
          newValue: "Archived",
        },
      ],
    });
    expect(action).toEqual("Archived");
  });

  test("returns `Returned to draft` when state changes to Archived", () => {
    const action = AuditTrailService.getActionFromDashboardAuditLog({
      ...baseAuditLog,
      event: "Update",
      modifiedProperties: [
        {
          property: "state",
          oldValue: "PublishPending",
          newValue: "Draft",
        },
      ],
    });
    expect(action).toEqual("Returned to draft");
  });
});
