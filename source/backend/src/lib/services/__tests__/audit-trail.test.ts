import { Dashboard, DASHBOARD_ITEM_TYPE } from "../../models/dashboard";
import AuditTrailService from "../audit-trail";
import AuditLogFactory from "../../factories/auditlog-factory";
import DashboardFactory from "../../factories/dashboard-factory";
import AuditLogRepository from "../../repositories/auditlog-repo";
import { ItemEvent } from "../..//models/auditlog";

jest.mock("../../factories/dashboard-factory");
jest.mock("../../factories/auditlog-factory");
jest.mock("../../repositories/auditlog-repo");

const timestamp = new Date();

describe("handleItemEvent", () => {
  it("discards event if item is not a Dashboard", async () => {
    const newItem = { foo: "bar", type: "not a dashboard" };
    const oldItem = { foo: "notbar", type: "not a dashboard" };

    await AuditTrailService.handleItemEvent(
      ItemEvent.Create,
      oldItem,
      newItem,
      timestamp
    );

    expect(DashboardFactory.fromItem).not.toBeCalled();
    expect(AuditLogRepository.saveAuditLog).not.toBeCalled();
    expect(AuditLogFactory.buildDashboardAuditLogFromEvent).not.toBeCalled();
  });

  it("creates an audit log for a dashboard create event", async () => {
    const newItem = { foo: "bar", type: DASHBOARD_ITEM_TYPE };
    const oldItem = null;

    const newDashboard = {} as Dashboard;
    DashboardFactory.fromItem = jest.fn().mockReturnValue(newDashboard);

    await AuditTrailService.handleItemEvent(
      ItemEvent.Create,
      oldItem,
      newItem,
      timestamp
    );

    expect(DashboardFactory.fromItem).toBeCalledWith(newItem);
    expect(AuditLogRepository.saveAuditLog).toBeCalled();
    expect(AuditLogFactory.buildDashboardAuditLogFromEvent).toBeCalledWith(
      ItemEvent.Create,
      timestamp,
      newDashboard,
      undefined
    );
  });

  it("creates an audit log for a dashboard update event", async () => {
    const newItem = { fizz: "buzz", type: DASHBOARD_ITEM_TYPE };
    const oldItem = { fizz: "notbuzz", type: DASHBOARD_ITEM_TYPE };

    const newDashboard = {} as Dashboard;
    const oldDashboard = {} as Dashboard;
    DashboardFactory.fromItem = jest
      .fn()
      .mockReturnValueOnce(newDashboard) // first call returns new dashboard
      .mockReturnValueOnce(oldDashboard); // second call is for old dashboard

    await AuditTrailService.handleItemEvent(
      ItemEvent.Update,
      oldItem,
      newItem,
      timestamp
    );

    expect(DashboardFactory.fromItem).toBeCalledWith(newItem);
    expect(DashboardFactory.fromItem).toBeCalledWith(oldItem);

    expect(AuditLogRepository.saveAuditLog).toBeCalled();
    expect(AuditLogFactory.buildDashboardAuditLogFromEvent).toBeCalledWith(
      ItemEvent.Update,
      timestamp,
      newDashboard,
      oldDashboard
    );
  });

  it("creates an audit log for a dashboard delete event", async () => {
    const newItem = null;
    const oldItem = { fizz: "buzz", type: DASHBOARD_ITEM_TYPE };

    const oldDashboard = {} as Dashboard;
    DashboardFactory.fromItem = jest.fn().mockReturnValue(oldDashboard);

    await AuditTrailService.handleItemEvent(
      ItemEvent.Delete,
      oldItem,
      newItem,
      timestamp
    );

    expect(DashboardFactory.fromItem).toBeCalledWith(oldItem);
    expect(AuditLogRepository.saveAuditLog).toBeCalled();
    expect(AuditLogFactory.buildDashboardAuditLogFromEvent).toBeCalledWith(
      ItemEvent.Delete,
      timestamp,
      oldDashboard,
      undefined
    );
  });
});
