/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

export enum ItemEvent {
    Create = "Create",
    Update = "Update",
    Delete = "Delete",
}

export interface ModifiedProperty {
    property: string;
    oldValue: any;
    newValue: any;
}

export interface AuditLog {
    itemId: string;
    timestamp: Date;
    userId: string;
    event: ItemEvent;
    modifiedProperties?: ModifiedProperty[];
}

// Represents a dynamodb item in the Audit Trail table
export interface AuditLogItem {
    pk: string;
    sk: string;
    type: string;
    userId: string;
    event: ItemEvent;
    modifiedProperties?: ModifiedProperty[];
}

export interface DashboardAuditLog extends AuditLog {
    version: number;
}

// Represents a dynamodb item in the Audit Trail table that
// contains attributes specific to Dashboard audit logs.
export interface DashboardAuditLogItem extends AuditLogItem {
    version: number;
}
