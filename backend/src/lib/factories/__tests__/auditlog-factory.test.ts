import {
  Dashboard,
  DashboardState,
  DASHBOARD_ITEM_TYPE,
} from "../../models/dashboard";
import AuditLogFactory from "../auditlog-factory";
import { ItemEvent } from "../../models/auditlog";

const timestamp = new Date();

describe("buildDashboardAuditLogFromEvent", () => {
  it("builds an audit log for a create event", () => {
    const dashboard: Dashboard = {
      id: "8d44e664",
      name: "Immigrant Population Dashboard",
      version: 1,
      parentDashboardId: "d5f6b6e4bb22",
      topicAreaId: "be9a",
      topicAreaName: "Department of Homeland Security",
      description: "",
      createdBy: "johndoe",
      updatedAt: new Date(),
      state: DashboardState.Draft,
    };

    const auditLog = AuditLogFactory.buildDashboardAuditLogFromEvent(
      ItemEvent.Create,
      timestamp,
      dashboard
    );

    expect(auditLog.event).toEqual(ItemEvent.Create);
    expect(auditLog.sk).toEqual(timestamp.toISOString());
    expect(auditLog.pk).toEqual("Dashboard#d5f6b6e4bb22");
    expect(auditLog.type).toEqual(DASHBOARD_ITEM_TYPE);
    expect(auditLog.userId).toEqual("johndoe");
    expect(auditLog.version).toEqual(1);
  });

  it("builds an audit log for an update event", () => {
    const dashboard: Dashboard = {
      id: "8d44e664",
      name: "Immigrant Population Dashboard",
      version: 1,
      parentDashboardId: "d5f6b6e4bb22",
      topicAreaId: "be9a",
      topicAreaName: "Department of Homeland Security",
      description: "",
      createdBy: "johndoe",
      updatedAt: new Date(),
      state: DashboardState.PublishPending,
    };

    const oldDashboard: Dashboard = {
      id: "8d44e664",
      name: "US Citizens Population Dashboard",
      version: 1,
      parentDashboardId: "d5f6b6e4bb22",
      topicAreaId: "be9a",
      topicAreaName: "Department of Homeland Security",
      description: "",
      createdBy: "johndoe",
      updatedAt: new Date(),
      state: DashboardState.Draft,
    };

    const auditLog = AuditLogFactory.buildDashboardAuditLogFromEvent(
      ItemEvent.Update,
      timestamp,
      dashboard,
      oldDashboard
    );

    expect(auditLog.event).toEqual(ItemEvent.Update);
    expect(auditLog.sk).toEqual(timestamp.toISOString());
    expect(auditLog.pk).toEqual("Dashboard#d5f6b6e4bb22");
    expect(auditLog.type).toEqual(DASHBOARD_ITEM_TYPE);
    expect(auditLog.userId).toEqual("Unknown");
    expect(auditLog.version).toEqual(1);
    expect(auditLog.modifiedProperties).toEqual(
      expect.arrayContaining([
        {
          property: "name",
          oldValue: "US Citizens Population Dashboard",
          newValue: "Immigrant Population Dashboard",
        },
        {
          property: "state",
          oldValue: DashboardState.Draft,
          newValue: DashboardState.PublishPending,
        },
        {
          property: "updatedAt",
          oldValue: oldDashboard.updatedAt.toISOString(),
          newValue: dashboard.updatedAt.toISOString(),
        },
      ])
    );
  });

  it("builds an audit log for a delete event", () => {
    const dashboard: Dashboard = {
      id: "8d44e664",
      name: "Immigrant Population Dashboard",
      version: 1,
      parentDashboardId: "d5f6b6e4bb22",
      topicAreaId: "be9a",
      topicAreaName: "Department of Homeland Security",
      description: "",
      createdBy: "johndoe",
      updatedAt: new Date(),
      state: DashboardState.Draft,
    };

    const auditLog = AuditLogFactory.buildDashboardAuditLogFromEvent(
      ItemEvent.Delete,
      timestamp,
      dashboard
    );

    expect(auditLog.event).toEqual(ItemEvent.Delete);
    expect(auditLog.sk).toEqual(timestamp.toISOString());
    expect(auditLog.pk).toEqual("Dashboard#d5f6b6e4bb22");
    expect(auditLog.type).toEqual(DASHBOARD_ITEM_TYPE);
    expect(auditLog.userId).toEqual("Unknown");
    expect(auditLog.version).toEqual(1);
  });
});
