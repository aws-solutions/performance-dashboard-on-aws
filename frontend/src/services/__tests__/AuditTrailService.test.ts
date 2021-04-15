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
    const action = AuditTrailService.getActionFromDashboardAuditLog(
      auditLog,
      (s: string) => {
        return "Deleted";
      }
    );
    expect(action).toEqual("Deleted");
  });

  test("returns `Created` when event is Create", () => {
    const auditLog: DashboardAuditLog = { ...baseAuditLog, event: "Create" };
    const action = AuditTrailService.getActionFromDashboardAuditLog(
      auditLog,
      (s: string) => {
        return "Created";
      }
    );
    expect(action).toEqual("Created");
  });

  test("returns `Edited` when modifiedProperties are not present", () => {
    const auditLog: DashboardAuditLog = {
      ...baseAuditLog,
      event: "Update",
    };
    const action = AuditTrailService.getActionFromDashboardAuditLog(
      auditLog,
      (s: string) => {
        return "Edited";
      }
    );
    expect(action).toEqual("Edited");
  });

  test("returns `Edited` when modifiedProperties are empty", () => {
    const auditLog: DashboardAuditLog = {
      ...baseAuditLog,
      event: "Update",
      modifiedProperties: [],
    };
    const action = AuditTrailService.getActionFromDashboardAuditLog(
      auditLog,
      (s: string) => {
        return "Edited";
      }
    );
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
    const action = AuditTrailService.getActionFromDashboardAuditLog(
      auditLog,
      (s: string) => {
        return "Edited";
      }
    );
    expect(action).toEqual("Edited");
  });

  test("returns `Moved to publish queue` when state changes to PublishPending", () => {
    const action = AuditTrailService.getActionFromDashboardAuditLog(
      {
        ...baseAuditLog,
        event: "Update",
        modifiedProperties: [
          {
            property: "state",
            oldValue: "Draft",
            newValue: "PublishPending",
          },
        ],
      },
      (s: string) => {
        return "Moved to publish queue";
      }
    );
    expect(action).toEqual("Moved to publish queue");
  });

  test("returns `Published` when state changes to Published", () => {
    const action = AuditTrailService.getActionFromDashboardAuditLog(
      {
        ...baseAuditLog,
        event: "Update",
        modifiedProperties: [
          {
            property: "state",
            oldValue: "PublishPending",
            newValue: "Published",
          },
        ],
      },
      (s: string) => {
        return "Published";
      }
    );
    expect(action).toEqual("Published");
  });

  test("returns `Archived` when state changes to Archived", () => {
    const action = AuditTrailService.getActionFromDashboardAuditLog(
      {
        ...baseAuditLog,
        event: "Update",
        modifiedProperties: [
          {
            property: "state",
            oldValue: "Published",
            newValue: "Archived",
          },
        ],
      },
      (s: string) => {
        return "Archived";
      }
    );
    expect(action).toEqual("Archived");
  });

  test("returns `Returned to draft` when state changes to Archived", () => {
    const action = AuditTrailService.getActionFromDashboardAuditLog(
      {
        ...baseAuditLog,
        event: "Update",
        modifiedProperties: [
          {
            property: "state",
            oldValue: "PublishPending",
            newValue: "Draft",
          },
        ],
      },
      (s: string) => {
        return "Returned to draft";
      }
    );
    expect(action).toEqual("Returned to draft");
  });
});

describe("removeNoisyAuditLogs", () => {
  test("it does not remove a Create event", () => {
    const createAuditLog: DashboardAuditLog = {
      itemId: "001",
      timestamp: new Date(),
      event: "Create",
      userId: "johndoe",
      version: 1,
    };

    const auditlogs = [createAuditLog];
    const result = AuditTrailService.removeNosiyAuditLogs(auditlogs);
    expect(result).toContain(createAuditLog);
  });

  test("it does not remove a Delete event", () => {
    const deleteAuditLog: DashboardAuditLog = {
      itemId: "001",
      timestamp: new Date(),
      event: "Delete",
      userId: "johndoe",
      version: 1,
    };

    const auditlogs = [deleteAuditLog];
    const result = AuditTrailService.removeNosiyAuditLogs(auditlogs);
    expect(result).toContain(deleteAuditLog);
  });

  test("it does not remove an Update event with other interesting properties", () => {
    const updateAuditLog: DashboardAuditLog = {
      itemId: "001",
      timestamp: new Date(),
      event: "Update",
      userId: "johndoe",
      version: 1,
      modifiedProperties: [
        {
          property: "updatedAt",
          oldValue: "foo",
          newValue: "bar",
        },
        {
          property: "state",
          oldValue: "Draft",
          newValue: "PublishPending",
        },
      ],
    };

    const auditlogs = [updateAuditLog];
    const result = AuditTrailService.removeNosiyAuditLogs(auditlogs);

    expect(result).toHaveLength(1);
    expect(result).toContain(updateAuditLog);
  });

  test("it removes an Update event with `updatedAt` as only property", () => {
    const updateAuditLog: DashboardAuditLog = {
      itemId: "001",
      timestamp: new Date(),
      event: "Update",
      userId: "johndoe",
      version: 1,
      modifiedProperties: [
        {
          property: "updatedAt",
          oldValue: "foo",
          newValue: "bar",
        },
      ],
    };

    const auditlogs = [updateAuditLog];
    const result = AuditTrailService.removeNosiyAuditLogs(auditlogs);

    expect(result).toHaveLength(0);
    expect(result).not.toContain(updateAuditLog);
  });
});
