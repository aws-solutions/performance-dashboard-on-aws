/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Dashboard, DashboardState, DASHBOARD_ITEM_TYPE } from "../../models/dashboard";
import AuditLogFactory from "../auditlog-factory";
import { DashboardAuditLogItem, ItemEvent } from "../../models/auditlog";

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
            displayTableOfContents: false,
            description: "",
            createdBy: "johndoe",
            updatedBy: "johndoe",
            updatedAt: new Date(),
            state: DashboardState.Draft,
        };

        const auditLog = AuditLogFactory.buildDashboardAuditLogFromEvent(
            ItemEvent.Create,
            timestamp,
            dashboard,
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
            displayTableOfContents: false,
            description: "",
            createdBy: "johndoe",
            updatedBy: "alice",
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
            displayTableOfContents: false,
            description: "",
            createdBy: "johndoe",
            updatedBy: "johndoe",
            updatedAt: new Date(),
            state: DashboardState.Draft,
        };

        const auditLog = AuditLogFactory.buildDashboardAuditLogFromEvent(
            ItemEvent.Update,
            timestamp,
            dashboard,
            oldDashboard,
        );

        expect(auditLog.event).toEqual(ItemEvent.Update);
        expect(auditLog.sk).toEqual(timestamp.toISOString());
        expect(auditLog.pk).toEqual("Dashboard#d5f6b6e4bb22");
        expect(auditLog.type).toEqual(DASHBOARD_ITEM_TYPE);
        expect(auditLog.userId).toEqual("alice");
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
            ]),
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
            displayTableOfContents: false,
            description: "",
            createdBy: "johndoe",
            updatedBy: "johndoe",
            updatedAt: new Date(),
            deletedBy: "johndoe",
            state: DashboardState.Draft,
        };

        const auditLog = AuditLogFactory.buildDashboardAuditLogFromEvent(
            ItemEvent.Delete,
            timestamp,
            dashboard,
        );

        expect(auditLog.event).toEqual(ItemEvent.Delete);
        expect(auditLog.sk).toEqual(timestamp.toISOString());
        expect(auditLog.pk).toEqual("Dashboard#d5f6b6e4bb22");
        expect(auditLog.type).toEqual(DASHBOARD_ITEM_TYPE);
        expect(auditLog.userId).toEqual("johndoe");
        expect(auditLog.version).toEqual(1);
    });
});

describe("fromItem", () => {
    it("returns a dashboard audit log", () => {
        const auditLogItem: DashboardAuditLogItem = {
            pk: "Dashboard#001",
            sk: "2021-02-06T02:53:33.935Z",
            type: DASHBOARD_ITEM_TYPE,
            userId: "johndoe",
            version: 1,
            event: ItemEvent.Update,
            modifiedProperties: [
                {
                    property: "name",
                    oldValue: "Foo",
                    newValue: "Bar",
                },
            ],
        };

        const auditLog = AuditLogFactory.fromItem(auditLogItem);
        expect(auditLog).not.toBe(null);
        expect(auditLog).toEqual({
            itemId: "001",
            timestamp: new Date("2021-02-06T02:53:33.935Z"),
            userId: "johndoe",
            version: 1,
            event: ItemEvent.Update,
            modifiedProperties: [
                {
                    property: "name",
                    oldValue: "Foo",
                    newValue: "Bar",
                },
            ],
        });
    });
});
