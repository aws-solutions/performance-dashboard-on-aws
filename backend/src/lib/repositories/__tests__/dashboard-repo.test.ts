/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { mocked } from "ts-jest/utils";
import { User } from "../../models/user";
import { Dashboard, DashboardState, DashboardItem } from "../../models/dashboard";
import DynamoDBService from "../../services/dynamodb";
import DashboardRepository from "../dashboard-repo";
import WidgetFactory from "../../factories/widget-factory";
import DashboardFactory from "../../factories/dashboard-factory";
import TopicAreaFactory from "../../factories/topicarea-factory";
import { WidgetType } from "../../models/widget";

jest.mock("../../services/dynamodb");

let user: User;
let tableName: string;
let repo: DashboardRepository;
let dynamodb = mocked(DynamoDBService.prototype);

beforeEach(() => {
    user = { userId: "test" };
    tableName = "MainTable";
    process.env.MAIN_TABLE = tableName;

    DynamoDBService.getInstance = jest.fn().mockReturnValue(dynamodb);
    repo = DashboardRepository.getInstance();
});

describe("DashboardRepository", () => {
    it("should be a singleton", () => {
        const repo2 = DashboardRepository.getInstance();
        expect(repo).toBe(repo2);
    });
});

describe("create", () => {
    it("should call putItem on dynamodb", async () => {
        const now = new Date();
        const dashboard: Dashboard = {
            id: "123",
            version: 1,
            name: "Dashboard1",
            topicAreaId: "456",
            topicAreaName: "Topic1",
            displayTableOfContents: false,
            description: "Description Test",
            state: DashboardState.Draft,
            parentDashboardId: "123",
            createdBy: user.userId,
            updatedAt: now,
            releaseNotes: "",
        };
        const item = DashboardFactory.toItem(dashboard);

        await repo.putDashboard(dashboard);

        expect(dynamodb.put).toHaveBeenCalledWith(
            expect.objectContaining({
                TableName: tableName,
                Item: item,
            }),
        );
    });
});

describe("createNew", () => {
    it("should call putItem on dynamodb", async () => {
        const dashboard = DashboardFactory.createNew(
            "Dashboard1",
            "456",
            "Topic1",
            "Description Test",
            user,
        );
        const item = DashboardFactory.toItem(dashboard);

        await repo.putDashboard(dashboard);

        expect(dynamodb.put).toHaveBeenCalledWith(
            expect.objectContaining({
                TableName: tableName,
                Item: item,
            }),
        );
    });
});

describe("updateDashboard", () => {
    it("should call updateItem with the correct keys", async () => {
        const now = new Date();
        await repo.updateDashboard(
            "123",
            "Dashboard1",
            "456",
            "Topic1",
            false,
            {},
            "Description Test",
            now.toISOString(),
            user,
        );
        expect(dynamodb.update).toHaveBeenCalledWith(
            expect.objectContaining({
                TableName: tableName,
                Key: {
                    pk: DashboardFactory.itemId("123"),
                    sk: DashboardFactory.itemId("123"),
                },
            }),
        );
    });

    it("should call update with all the fields", async () => {
        const now = new Date();
        jest.useFakeTimers("modern");
        jest.setSystemTime(now);
        await repo.updateDashboard(
            "123",
            "Dashboard1",
            "456",
            "Topic1",
            false,
            {},
            "Description Test",
            now.toISOString(),
            user,
        );
        expect(dynamodb.update).toHaveBeenCalledWith(
            expect.objectContaining({
                UpdateExpression:
                    "set #dashboardName = :dashboardName, #topicAreaId = :topicAreaId, #topicAreaName = :topicAreaName, #displayTableOfContents = :displayTableOfContents, #description = :description, #updatedAt = :updatedAt, #updatedBy = :userId, #tableOfContents = :tableOfContents",
                ExpressionAttributeValues: {
                    ":dashboardName": "Dashboard1",
                    ":topicAreaId": TopicAreaFactory.itemId("456"),
                    ":topicAreaName": "Topic1",
                    ":displayTableOfContents": false,
                    ":tableOfContents": {},
                    ":description": "Description Test",
                    ":lastUpdatedAt": now.toISOString(),
                    ":updatedAt": now.toISOString(),
                    ":userId": user.userId,
                },
            }),
        );
    });
});

describe("getDashboardVersions", () => {
    it("returns empty array when there is no dashboard", async () => {
        dynamodb.query = jest.fn().mockReturnValue({ Items: [] });
        const dashboard = await repo.getDashboardVersions("123");
        expect(dashboard).toEqual([]);
    });

    it("performs a query using GSI and a filter by state", async () => {
        await repo.getDashboardVersions("123");
        expect(dynamodb.query).toBeCalledWith({
            TableName: tableName,
            IndexName: "byParentDashboard",
            KeyConditionExpression: "parentDashboardId = :parentDashboardId",
            ExpressionAttributeValues: {
                ":parentDashboardId": "123",
            },
        });
    });

    it("returns a dashboard when is found", async () => {
        const existingDraft: DashboardItem = {
            pk: "Dashboard#xyz",
            sk: "Dashboard#xyz",
            type: "Dashboard",
            version: 2,
            parentDashboardId: "123",
            topicAreaId: "TopicArea#abc",
            topicAreaName: "Health",
            displayTableOfContents: false,
            dashboardName: "My Health Dashboard",
            description: "A relevant description",
            createdBy: "johndoe",
            updatedBy: "johndoe",
            updatedAt: new Date().toISOString(),
            state: "Draft",
            releaseNotes: "",
        };

        dynamodb.query = jest.fn().mockReturnValue({ Items: [existingDraft] });
        const dashboard = DashboardFactory.fromItem(existingDraft);

        const dashboardVersions = await repo.getDashboardVersions("123");
        expect(dashboardVersions).toEqual([dashboard]);
    });
});

describe("DashboardRepository.publishDashboard", () => {
    let now: Date;
    beforeEach(() => {
        now = new Date();
        jest.useFakeTimers("modern");
        jest.setSystemTime(now);
        dynamodb.transactWrite = jest.fn();
    });

    it("should call update with the correct keys and all the fields", async () => {
        repo.getDashboardVersions = jest.fn().mockReturnValue([]);
        await repo.publishDashboard(
            "123",
            "456",
            now.toISOString(),
            "release note test",
            user,
            "my-friendly-url",
        );

        expect(dynamodb.transactWrite).toHaveBeenCalledWith({
            TransactItems: [
                {
                    Update: {
                        TableName: tableName,
                        Key: {
                            pk: DashboardFactory.itemId("123"),
                            sk: DashboardFactory.itemId("123"),
                        },
                        UpdateExpression:
                            "set #state = :state, #updatedAt = :updatedAt, " +
                            "#releaseNotes = :releaseNotes, #updatedBy = :userId, " +
                            "#publishedBy = :userId, #friendlyURL = :friendlyURL",
                        ExpressionAttributeValues: {
                            ":state": "Published",
                            ":lastUpdatedAt": now.toISOString(),
                            ":updatedAt": now.toISOString(),
                            ":releaseNotes": "release note test",
                            ":userId": user.userId,
                            ":friendlyURL": "my-friendly-url",
                        },
                        ConditionExpression: "#updatedAt <= :lastUpdatedAt",
                        ExpressionAttributeNames: {
                            "#releaseNotes": "releaseNotes",
                            "#state": "state",
                            "#updatedAt": "updatedAt",
                            "#updatedBy": "updatedBy",
                            "#publishedBy": "publishedBy",
                            "#friendlyURL": "friendlyURL",
                        },
                    },
                },
            ],
        });
    });

    it("should move an Archived version to inactive", async () => {
        const parentDashboardId = "abc";

        // Simulate there is an archived version already
        const getDashboardVersions = jest.spyOn(repo, "getDashboardVersions");
        getDashboardVersions.mockReturnValue(
            Promise.resolve([
                {
                    id: "001",
                    version: 1,
                    name: "Archived Dashboard",
                    topicAreaId: "456",
                    topicAreaName: "Bananas",
                    displayTableOfContents: false,
                    description: "Description Test",
                    state: DashboardState.Archived,
                    parentDashboardId: parentDashboardId,
                    createdBy: user.userId,
                    updatedAt: new Date(),
                    releaseNotes: "",
                },
            ]),
        );

        await repo.publishDashboard(
            "002",
            parentDashboardId,
            new Date().toISOString(),
            "release note test",
            user,
            "my-friendly-url",
        );

        const transaction = dynamodb.transactWrite.mock.calls[0][0];
        expect(transaction.TransactItems).toHaveLength(2);
        expect(transaction.TransactItems).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    Update: {
                        TableName: tableName,
                        Key: {
                            pk: DashboardFactory.itemId("001"),
                            sk: DashboardFactory.itemId("001"),
                        },
                        UpdateExpression:
                            "set #state = :state, #updatedAt = :updatedAt, #updatedBy = :userId " +
                            "REMOVE #friendlyURL", // Make sure friendlyURL is removed
                        ExpressionAttributeValues: {
                            ":state": "Inactive", // Verify Archived version moves to Inactive
                            ":updatedAt": now.toISOString(),
                            ":userId": user.userId,
                        },
                        ExpressionAttributeNames: {
                            "#state": "state",
                            "#updatedAt": "updatedAt",
                            "#updatedBy": "updatedBy",
                            "#friendlyURL": "friendlyURL",
                        },
                    },
                }),
            ]),
        );

        getDashboardVersions.mockRestore();
    });

    it("should move a Published version to inactive", async () => {
        const parentDashboardId = "abc";

        // Simulate there is a Published version already
        const getDashboardVersions = jest.spyOn(repo, "getDashboardVersions");
        getDashboardVersions.mockReturnValue(
            Promise.resolve([
                {
                    id: "001",
                    version: 1,
                    name: "Archived Dashboard",
                    topicAreaId: "456",
                    topicAreaName: "Bananas",
                    displayTableOfContents: false,
                    description: "Description Test",
                    state: DashboardState.Published, // PUBLISHED
                    parentDashboardId: parentDashboardId,
                    createdBy: user.userId,
                    updatedAt: new Date(),
                    releaseNotes: "",
                },
            ]),
        );

        await repo.publishDashboard(
            "002",
            parentDashboardId,
            new Date().toISOString(),
            "release note test",
            user,
            "my-friendly-url",
        );

        const transaction = dynamodb.transactWrite.mock.calls[0][0];
        expect(transaction.TransactItems).toHaveLength(2);
        expect(transaction.TransactItems).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    Update: {
                        TableName: tableName,
                        Key: {
                            pk: DashboardFactory.itemId("001"),
                            sk: DashboardFactory.itemId("001"),
                        },
                        UpdateExpression:
                            "set #state = :state, #updatedAt = :updatedAt, #updatedBy = :userId " +
                            "REMOVE #friendlyURL", // Make sure friendlyURL is removed
                        ExpressionAttributeValues: {
                            ":state": "Inactive", // Verify Published version moves to Inactive
                            ":updatedAt": now.toISOString(),
                            ":userId": user.userId,
                        },
                        ExpressionAttributeNames: {
                            "#state": "state",
                            "#updatedAt": "updatedAt",
                            "#updatedBy": "updatedBy",
                            "#friendlyURL": "friendlyURL",
                        },
                    },
                }),
            ]),
        );

        getDashboardVersions.mockRestore();
    });
});

describe("publishPendingDashboard", () => {
    let updatedDashboard: Dashboard;
    const now = new Date();

    beforeEach(() => {
        const updateResult = { Attributes: {} };
        dynamodb.update = jest.fn().mockReturnValue(updateResult);
        jest.spyOn(DashboardFactory, "fromItem").mockReturnValueOnce(updatedDashboard);

        jest.useFakeTimers("modern");
        jest.setSystemTime(now);
    });

    it("should call update with the correct keys", async () => {
        await repo.publishPendingDashboard("123", now.toISOString(), user);
        expect(dynamodb.update).toHaveBeenCalledWith(
            expect.objectContaining({
                TableName: tableName,
                Key: {
                    pk: DashboardFactory.itemId("123"),
                    sk: DashboardFactory.itemId("123"),
                },
            }),
        );
    });

    it("should call update with all the fields", async () => {
        await repo.publishPendingDashboard("123", now.toISOString(), user, "Lorem ipsum");

        expect(dynamodb.update).toHaveBeenCalledWith(
            expect.objectContaining({
                UpdateExpression:
                    "set #state = :state, #updatedAt = :updatedAt, #updatedBy = :userId, " +
                    "#submittedBy = :userId, #releaseNotes = :releaseNotes",
                ExpressionAttributeValues: {
                    ":state": "PublishPending",
                    ":lastUpdatedAt": now.toISOString(),
                    ":updatedAt": now.toISOString(),
                    ":userId": user.userId,
                    ":releaseNotes": "Lorem ipsum",
                },
            }),
        );
    });

    it("returns the updated dashboard", async () => {
        const dashboard = await repo.publishPendingDashboard("123", now.toISOString(), user);

        expect(dashboard).toBe(updatedDashboard);
        expect(dynamodb.update).toBeCalledWith(
            expect.objectContaining({
                ReturnValues: "ALL_NEW",
            }),
        );
    });
});

describe("DashboardRepository.archiveDashboard", () => {
    let now: Date;
    beforeEach(() => {
        now = new Date();
        jest.useFakeTimers("modern");
        jest.setSystemTime(now);
    });

    it("should call update with the correct keys", async () => {
        await repo.archiveDashboard("123", now.toISOString(), user);
        expect(dynamodb.update).toHaveBeenCalledWith(
            expect.objectContaining({
                TableName: tableName,
                Key: {
                    pk: DashboardFactory.itemId("123"),
                    sk: DashboardFactory.itemId("123"),
                },
            }),
        );
    });

    it("should call update with all the fields", async () => {
        await repo.archiveDashboard("123", now.toISOString(), user);
        expect(dynamodb.update).toHaveBeenCalledWith(
            expect.objectContaining({
                UpdateExpression:
                    "set #state = :state, #updatedAt = :updatedAt, #updatedBy = :userId, " +
                    "#archivedBy = :userId REMOVE #friendlyURL",
                ExpressionAttributeValues: {
                    ":state": "Archived",
                    ":lastUpdatedAt": now.toISOString(),
                    ":updatedAt": now.toISOString(),
                    ":userId": user.userId,
                },
            }),
        );
    });
});

describe("DashboardRepository.moveToDraft", () => {
    let now: Date;
    beforeEach(() => {
        now = new Date();
        jest.useFakeTimers("modern");
        jest.setSystemTime(now);
    });

    it("should call update with the correct keys", async () => {
        await repo.moveToDraft("123", now.toISOString(), user);
        expect(dynamodb.update).toHaveBeenCalledWith(
            expect.objectContaining({
                TableName: tableName,
                Key: {
                    pk: DashboardFactory.itemId("123"),
                    sk: DashboardFactory.itemId("123"),
                },
            }),
        );
    });

    it("should call update with all the fields", async () => {
        await repo.moveToDraft("123", now.toISOString(), user);
        expect(dynamodb.update).toHaveBeenCalledWith(
            expect.objectContaining({
                UpdateExpression:
                    "set #state = :state, #updatedAt = :updatedAt, #updatedBy = :userId, #submittedBy = :noUserId",
                ExpressionAttributeValues: {
                    ":state": "Draft",
                    ":lastUpdatedAt": now.toISOString(),
                    ":updatedAt": now.toISOString(),
                    ":userId": user.userId,
                    ":noUserId": "",
                },
            }),
        );
    });
});

describe("DashboardRepository.delete", () => {
    it("should call delete with the correct key", async () => {
        await repo.delete("123");
        expect(dynamodb.delete).toHaveBeenCalledWith(
            expect.objectContaining({
                TableName: tableName,
                Key: {
                    pk: DashboardFactory.itemId("123"),
                    sk: DashboardFactory.itemId("123"),
                },
            }),
        );
    });
});

describe("listDashboards", () => {
    it("should query using the correct GSI", async () => {
        // Mock query response
        dynamodb.query = jest.fn().mockReturnValue({});

        await repo.listDashboards();

        expect(dynamodb.query).toHaveBeenCalledWith(
            expect.objectContaining({
                TableName: tableName,
                IndexName: "byType",
            }),
        );
    });

    it("returns a list of dashboards", async () => {
        // Mock query response
        const now = new Date();
        dynamodb.query = jest.fn().mockReturnValue({
            Items: [
                {
                    pk: "Dashboard#123",
                    sk: "Dashboard#123",
                    topicAreaId: "TopicArea#456",
                    topicAreaName: "Topic 1",
                    dashboardName: "Test name",
                    description: "description test",
                    createdBy: "test",
                    updatedBy: "test",
                    submittedBy: "test",
                    publishedBy: "test",
                    archivedBy: "test",
                    deletedBy: "test",
                    updatedAt: now.toISOString(),
                    state: "Draft",
                },
            ],
        });

        const list = await repo.listDashboards();
        expect(list.length).toEqual(1);
        expect(list[0]).toEqual({
            id: "123",
            name: "Test name",
            topicAreaId: "456",
            topicAreaName: "Topic 1",
            description: "description test",
            createdBy: "test",
            updatedBy: "test",
            submittedBy: "test",
            publishedBy: "test",
            archivedBy: "test",
            deletedBy: "test",
            updatedAt: now,
            state: "Draft",
        });
    });

    it("returns a dashboard by id", async () => {
        // Mock query response
        const now = new Date();
        dynamodb.get = jest.fn().mockReturnValue({
            Item: {
                pk: "Dashboard#123",
                sk: "Dashboard#123",
                topicAreaId: "TopicArea#456",
                topicAreaName: "Topic 1",
                dashboardName: "Test name",
                description: "description test",
                createdBy: "test",
                updatedBy: "test",
                submittedBy: "test",
                publishedBy: "test",
                archivedBy: "test",
                deletedBy: "test",
                updatedAt: now.toISOString(),
                state: "Draft",
            },
        });

        const item = await repo.getDashboardById("123");
        expect(item).toEqual({
            id: "123",
            name: "Test name",
            topicAreaId: "456",
            topicAreaName: "Topic 1",
            description: "description test",
            createdBy: "test",
            updatedBy: "test",
            submittedBy: "test",
            publishedBy: "test",
            archivedBy: "test",
            deletedBy: "test",
            updatedAt: now,
            state: "Draft",
        });
    });

    it("returns a list of dashboards within a topic area", async () => {
        // Mock query response
        dynamodb.query = jest.fn().mockReturnValue({});

        const topicAreaId = "456";

        await repo.listDashboardsInTopicArea(topicAreaId);

        expect(dynamodb.query).toHaveBeenCalledWith(
            expect.objectContaining({
                TableName: tableName,
                KeyConditionExpression: "#topicAreaId = :topicAreaId",
                ExpressionAttributeValues: {
                    ":topicAreaId": TopicAreaFactory.itemId(topicAreaId),
                },
            }),
        );

        const now = new Date();
        // Mock query response
        dynamodb.query = jest.fn().mockReturnValue({
            Items: [
                {
                    pk: "Dashboard#123",
                    sk: "Dashboard#123",
                    type: "Dashboard",
                    topicAreaId: `TopicArea#${topicAreaId}`,
                    topicAreaName: "Topic 1",
                    dashboardName: "Test name",
                    description: "description test",
                    createdBy: "test",
                    updatedBy: "test",
                    submittedBy: "test",
                    publishedBy: "test",
                    archivedBy: "test",
                    deletedBy: "test",
                    updatedAt: now.toISOString(),
                    state: "Draft",
                },
            ],
        });

        const list = await repo.listDashboardsInTopicArea(topicAreaId);
        expect(list.length).toEqual(1);
        expect(list[0]).toEqual({
            id: "123",
            name: "Test name",
            topicAreaId: topicAreaId,
            topicAreaName: "Topic 1",
            description: "description test",
            createdBy: "test",
            updatedBy: "test",
            submittedBy: "test",
            publishedBy: "test",
            archivedBy: "test",
            deletedBy: "test",
            updatedAt: now,
            state: "Draft",
        });
    });
});

describe("getDashboardWithWidgets", () => {
    it("throws an error when dashboardId is not found", () => {
        dynamodb.query = jest.fn().mockReturnValue({ Items: [] });
        return expect(repo.getDashboardWithWidgets("123")).rejects.toThrowError();
    });

    it("returns a dashboard with no widgets", async () => {
        dynamodb.query = jest.fn().mockReturnValue({
            Items: [
                {
                    pk: "Dashboard#123",
                    sk: "Dashboard#123",
                    name: "AWS Dashboard",
                    type: "Dashboard",
                    topicAreaId: "TopicArea#cb9ad",
                },
            ],
        });

        const dashboard = await repo.getDashboardWithWidgets("123");
        expect(dashboard.id).toEqual("123");
        expect(dashboard.widgets).toHaveLength(0);
    });

    it("returns a dashboard with widgets", async () => {
        dynamodb.query = jest.fn().mockReturnValue({
            Items: [
                {
                    pk: "Dashboard#123",
                    sk: "Dashboard#123",
                    name: "AWS Dashboard",
                    type: "Dashboard",
                    topicAreaId: "TopicArea#cb9ad",
                },
                {
                    pk: "Dashboard#123",
                    sk: "Widget#abc",
                    type: "Widget",
                    name: "Some name",
                    widgetType: "Text",
                    content: {},
                },
            ],
        });

        const dashboard = await repo.getDashboardWithWidgets("123");
        expect(dashboard.widgets).toHaveLength(1);
    });
});

describe("listPublishedDashboards", () => {
    it("returns empty array when no published dashboards found", async () => {
        dynamodb.query = jest.fn().mockReturnValue({ Items: [] });
        const dashboards = await repo.listPublishedDashboards();
        expect(dashboards.length).toEqual(0);
    });

    it("performs a query and filters by state=Published", async () => {
        await repo.listPublishedDashboards();
        expect(dynamodb.query).toBeCalledWith({
            TableName: tableName,
            IndexName: "byType",
            KeyConditionExpression: "#type = :type",
            FilterExpression: "#state = :state",
            ExpressionAttributeNames: {
                "#type": "type",
                "#state": "state",
            },
            ExpressionAttributeValues: {
                ":type": "Dashboard",
                ":state": DashboardState.Published,
            },
        });
    });
});

describe("getCurrentDraft", () => {
    it("returns null when there is no draft", async () => {
        dynamodb.query = jest.fn().mockReturnValue({ Items: [] });
        const draft = await repo.getCurrentDraft("123");
        expect(draft).toBeNull();
    });

    it("performs a query using GSI and a filter by state", async () => {
        await repo.getCurrentDraft("123");
        expect(dynamodb.query).toBeCalledWith({
            TableName: tableName,
            IndexName: "byParentDashboard",
            KeyConditionExpression: "parentDashboardId = :parentDashboardId",
            FilterExpression: "#state = :state",
            ExpressionAttributeNames: {
                "#state": "state",
            },
            ExpressionAttributeValues: {
                ":parentDashboardId": "123",
                ":state": DashboardState.Draft,
            },
        });
    });

    it("returns a dashboard when a draft is found", async () => {
        const existingDraft: DashboardItem = {
            pk: "Dashboard#xyz",
            sk: "Dashboard#xyz",
            type: "Dashboard",
            version: 2,
            parentDashboardId: "123",
            topicAreaId: "TopicArea#abc",
            topicAreaName: "Health",
            displayTableOfContents: false,
            dashboardName: "My Health Dashboard",
            description: "A relevant description",
            createdBy: "johndoe",
            updatedAt: new Date().toISOString(),
            state: "Draft",
            releaseNotes: "",
        };

        dynamodb.query = jest.fn().mockReturnValue({ Items: [existingDraft] });
        const dashboard = DashboardFactory.fromItem(existingDraft);

        const draft = await repo.getCurrentDraft("123");
        expect(draft).toEqual(dashboard);
    });
});

describe("DashboardRepository.saveDashboardAndWidgets", () => {
    it("should call saveDashboardAndWidgets with the correct key", async () => {
        const now = new Date();
        jest.useFakeTimers("modern");
        jest.setSystemTime(now);
        const dashboard: Dashboard = {
            id: "123",
            version: 1,
            name: "Dashboard1",
            topicAreaId: "456",
            topicAreaName: "Topic1",
            displayTableOfContents: false,
            description: "Description Test",
            state: DashboardState.Draft,
            parentDashboardId: "123",
            createdBy: user.userId,
            updatedAt: now,
            releaseNotes: "",
            widgets: [
                {
                    id: "abc",
                    dashboardId: "123",
                    widgetType: WidgetType.Text,
                    order: 0,
                    updatedAt: new Date(),
                    name: "AWS",
                    content: {},
                },
            ],
        };
        await repo.saveDashboardAndWidgets(dashboard);
        expect(dynamodb.transactWrite).toHaveBeenCalledWith(
            expect.objectContaining({
                TransactItems: [
                    {
                        Put: {
                            TableName: tableName,
                            Item: {
                                pk: DashboardFactory.itemId("123"),
                                sk: DashboardFactory.itemId("123"),
                                version: 1,
                                dashboardName: "Dashboard1",
                                topicAreaId: "TopicArea#456",
                                topicAreaName: "Topic1",
                                displayTableOfContents: false,
                                description: "Description Test",
                                state: DashboardState.Draft,
                                type: "Dashboard",
                                parentDashboardId: "123",
                                createdBy: user.userId,
                                updatedAt: now.toISOString(),
                                releaseNotes: "",
                            },
                        },
                    },
                    {
                        Put: {
                            Item: {
                                content: {},
                                name: "AWS",
                                order: 0,
                                pk: "Dashboard#123",
                                sk: "Widget#abc",
                                type: "Widget",
                                updatedAt: now.toISOString(),
                                widgetType: "Text",
                            },
                            TableName: "MainTable",
                        },
                    },
                ],
            }),
        );
    });
});

describe("DashboardRepository.deleteDashboardsAndWidgets", () => {
    it("should call delete dashboard with the correct key", async () => {
        repo.getDashboardWithWidgets = jest
            .fn()
            .mockReturnValueOnce({
                id: "123",
                state: DashboardState.Draft,
                widgets: [
                    {
                        id: "abc",
                    },
                ],
            })
            .mockReturnValueOnce({
                id: "456",
                state: DashboardState.Draft,
            });

        await repo.deleteDashboardsAndWidgets(["123", "456"], user);
        expect(dynamodb.transactWrite).toHaveBeenCalledWith(
            expect.objectContaining({
                TransactItems: [
                    {
                        Update: {
                            TableName: tableName,
                            Key: {
                                pk: DashboardFactory.itemId("123"),
                                sk: DashboardFactory.itemId("123"),
                            },
                            UpdateExpression: "set #deletedBy = :userId",
                            ExpressionAttributeValues: {
                                ":userId": user.userId,
                            },
                            ExpressionAttributeNames: {
                                "#deletedBy": "deletedBy",
                            },
                        },
                    },
                    {
                        Update: {
                            TableName: tableName,
                            Key: {
                                pk: DashboardFactory.itemId("456"),
                                sk: DashboardFactory.itemId("456"),
                            },
                            UpdateExpression: "set #deletedBy = :userId",
                            ExpressionAttributeValues: {
                                ":userId": user.userId,
                            },
                            ExpressionAttributeNames: {
                                "#deletedBy": "deletedBy",
                            },
                        },
                    },
                ],
            }),
        );

        expect(dynamodb.transactWrite).toHaveBeenCalledWith(
            expect.objectContaining({
                TransactItems: [
                    {
                        Delete: {
                            TableName: tableName,
                            Key: {
                                pk: DashboardFactory.itemId("123"),
                                sk: DashboardFactory.itemId("123"),
                            },
                        },
                    },
                    {
                        Delete: {
                            TableName: tableName,
                            Key: {
                                pk: WidgetFactory.itemPk("123"),
                                sk: WidgetFactory.itemSk("abc"),
                            },
                        },
                    },
                    {
                        Delete: {
                            TableName: tableName,
                            Key: {
                                pk: DashboardFactory.itemId("456"),
                                sk: DashboardFactory.itemId("456"),
                            },
                        },
                    },
                ],
            }),
        );
    });
});

describe("getNextVersionNumber", () => {
    let getDashboardVersions: jest.SpyInstance;
    beforeEach(() => {
        getDashboardVersions = jest.spyOn(repo, "getDashboardVersions");
    });

    afterEach(() => {
        getDashboardVersions.mockRestore();
    });

    it("returns 1 when no dashboards are found", async () => {
        getDashboardVersions.mockImplementation(() => Promise.resolve([]));
        const nextVersion = await repo.getNextVersionNumber("123");
        expect(nextVersion).toEqual(1);
    });

    it("returns the maximum version plus one", async () => {
        const dashboards: Array<Dashboard> = [
            {
                id: "xyz",
                version: 1,
                name: "Dashboard v1",
                topicAreaId: "456",
                topicAreaName: "Topic1",
                displayTableOfContents: false,
                description: "Description Test",
                state: DashboardState.Draft,
                parentDashboardId: "123",
                createdBy: user.userId,
                updatedAt: new Date(),
            },
            {
                id: "abc",
                version: 2,
                name: "Dashboard v2",
                topicAreaId: "456",
                topicAreaName: "Topic1",
                displayTableOfContents: false,
                description: "Description Test",
                state: DashboardState.Published,
                parentDashboardId: "123",
                createdBy: user.userId,
                updatedAt: new Date(),
            },
        ];

        getDashboardVersions.mockImplementation(() => Promise.resolve(dashboards));
        const nextVersion = await repo.getNextVersionNumber("123");
        expect(nextVersion).toEqual(3);
    });

    it("handles incorrect versions gracefully", async () => {
        const dashboards: Array<Dashboard> = [
            {
                id: "xyz",
                version: undefined as unknown as number, // incorrect version
                name: "Dashboard v1",
                topicAreaId: "456",
                topicAreaName: "Topic1",
                displayTableOfContents: false,
                description: "Description Test",
                state: DashboardState.Draft,
                parentDashboardId: "123",
                createdBy: user.userId,
                updatedAt: new Date(),
            },
        ];

        getDashboardVersions.mockImplementation(() => Promise.resolve(dashboards));
        const nextVersion = await repo.getNextVersionNumber("123");
        expect(nextVersion).toEqual(1);
    });

    it("handles a mix of incorrect and correct versions", async () => {
        const dashboards: Array<Dashboard> = [
            {
                id: "xyz",
                version: undefined as unknown as number, // incorrect version
                name: "Dashboard v1",
                topicAreaId: "456",
                topicAreaName: "Topic1",
                displayTableOfContents: false,
                description: "Description Test",
                state: DashboardState.Draft,
                parentDashboardId: "123",
                createdBy: user.userId,
                updatedAt: new Date(),
            },
            {
                id: "abc",
                version: 1,
                name: "Dashboard v1",
                topicAreaId: "456",
                topicAreaName: "Topic1",
                displayTableOfContents: false,
                description: "Description Test",
                state: DashboardState.Draft,
                parentDashboardId: "123",
                createdBy: user.userId,
                updatedAt: new Date(),
            },
        ];

        getDashboardVersions.mockImplementation(() => Promise.resolve(dashboards));
        const nextVersion = await repo.getNextVersionNumber("123");
        expect(nextVersion).toEqual(2);
    });
});

describe("updateTopicAreaName", () => {
    it("updates all dashboards with new topic area name", async () => {
        const dashboards = [
            {
                id: "abc",
                version: 1,
                name: "Dashboard v1",
                topicAreaId: "456",
                topicAreaName: "Topic1",
                displayTableOfContents: false,
                description: "Description Test",
                state: DashboardState.Draft,
                parentDashboardId: "123",
                createdBy: user.userId,
                updatedAt: new Date(),
            },
        ];

        await repo.updateTopicAreaName(dashboards, "New Topic Area Name", user);
        expect(dynamodb.transactWrite).toBeCalledWith({
            TransactItems: expect.arrayContaining([
                expect.objectContaining({
                    Update: {
                        TableName: tableName,
                        Key: {
                            pk: "Dashboard#abc",
                            sk: "Dashboard#abc",
                        },
                        UpdateExpression:
                            "set topicAreaName = :topicAreaName, #updatedBy = :updatedBy",
                        ExpressionAttributeNames: {
                            "#updatedBy": "updatedBy",
                        },
                        ExpressionAttributeValues: {
                            ":topicAreaName": "New Topic Area Name",
                            ":updatedBy": user.userId,
                        },
                    },
                }),
            ]),
        });
    });
});

describe("getDashboardByFriendlyURL", () => {
    it("queries the correct GSI", async () => {
        await repo.getDashboardByFriendlyURL("my-friendly-url");
        expect(dynamodb.query).toBeCalledWith(
            expect.objectContaining({
                TableName: tableName,
                IndexName: "byFriendlyURL",
            }),
        );
    });

    it("returns the dashboard associated to the friendlyURL", async () => {
        const items: DashboardItem[] = [
            {
                pk: "Dashboard#123",
                sk: "Dashboard#123",
                type: "Dashboard",
                parentDashboardId: "123",
                version: 1,
                description: "",
                createdBy: "johndoe",
                state: "Published",
                dashboardName: "My Dashboard",
                topicAreaId: "001",
                topicAreaName: "Environment",
                displayTableOfContents: false,
                updatedAt: new Date().toISOString(),
                friendlyURL: "my-friendly-url",
            },
        ];

        dynamodb.query = jest.fn().mockReturnValue({ Items: items });
        const dashboard = await repo.getDashboardByFriendlyURL("my-friendly-url");
        expect(dashboard?.friendlyURL).toEqual("my-friendly-url");
    });
});
