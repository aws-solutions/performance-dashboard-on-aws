/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Dashboard, DASHBOARD_ITEM_TYPE } from "../models/dashboard";
import { ItemEvent } from "../models/auditlog";
import DashboardFactory from "../factories/dashboard-factory";
import AuditLogFactory from "../factories/auditlog-factory";
import AuditLogRepository from "../repositories/auditlog-repo";
import logger from "./logger";

/**
 * Handles a Create, Delete or Update event that happened to
 * a DynamoDB item on the main table. i.e. Dashboard was updated.
 */
async function handleItemEvent(event: ItemEvent, oldItem: any, newItem: any, timestamp: Date) {
    const itemType = newItem?.type || oldItem?.type;
    // For now, we only care about capturing changes for Dashboard items
    if (itemType === DASHBOARD_ITEM_TYPE) {
        let dashboard: Dashboard;
        let oldDashboard = undefined;

        switch (event) {
            case ItemEvent.Create:
                dashboard = DashboardFactory.fromItem(newItem);
                break;
            case ItemEvent.Update:
                dashboard = DashboardFactory.fromItem(newItem);
                oldDashboard = DashboardFactory.fromItem(oldItem);
                break;
            case ItemEvent.Delete:
                dashboard = DashboardFactory.fromItem(oldItem);
                break;
            default:
                logger.error("Invalid event");
                return;
        }

        const auditLogItem = AuditLogFactory.buildDashboardAuditLogFromEvent(
            event,
            timestamp,
            dashboard,
            oldDashboard,
        );

        await AuditLogRepository.saveAuditLog(auditLogItem);
        logger.info("Saved audit log record for dashboard");
    }
}

export default {
    handleItemEvent,
};
