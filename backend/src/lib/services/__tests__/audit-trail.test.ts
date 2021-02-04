import AuditTrailService from "../audit-trail";

const timestamp = new Date();

describe("handleCreatedItem", () => {
  it("does nothing", async () => {
    const newItem = {};
    await AuditTrailService.handleCreatedItem(newItem, timestamp);
  });
});

describe("handleModifiedItem", () => {
  it("does nothing", async () => {
    const newItem = {};
    const oldItem = {};
    await AuditTrailService.handleModifiedItem(oldItem, newItem, timestamp);
  });
});

describe("handleDeletedItem", () => {
  it("does nothing", async () => {
    const oldItem = {};
    await AuditTrailService.handleDeletedItem(oldItem, timestamp);
  });
});
