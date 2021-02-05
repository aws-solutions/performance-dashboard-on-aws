// Represents a dynamodb item in the Audit Trail table
export interface AuditLogItem {
  pk: string;
  sk: string;
  type: string;
  userId: string;
  event: ItemEvent;
}

export enum ItemEvent {
  Create = "Create",
  Update = "Update",
  Delete = "Delete",
}

export type ModifiedProperty = {
  property: string;
  oldValue: any;
  newValue: any;
};

// Represents a dynamodb item in the Audit Trail table that
// contains attributes specific to Dashboard audit logs.
export interface DashboardAuditLogItem extends AuditLogItem {
  version: number;
  modifiedProperties?: ModifiedProperty[];
}
