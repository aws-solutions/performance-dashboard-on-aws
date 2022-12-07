/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { User } from "../models/user";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import DashboardFactory from "../factories/dashboard-factory";
import TopicAreaFactory from "../factories/topicarea-factory";
import WidgetFactory from "../factories/widget-factory";
import { WidgetItem } from "../models/widget";
import { ItemNotFound, InvalidState } from "../errors";
import { Dashboard, DashboardList, DashboardItem, DashboardState } from "../models/dashboard";
import BaseRepository from "./base";
import logger from "../services/logger";

class DashboardRepository extends BaseRepository {
    private static instance: DashboardRepository;
    private constructor() {
        super();
    }

    static getInstance(): DashboardRepository {
        if (!DashboardRepository.instance) {
            DashboardRepository.instance = new DashboardRepository();
        }

        return DashboardRepository.instance;
    }

    public async getDashboardById(dashboardId: string) {
        const result = await this.dynamodb.get({
            TableName: this.tableName,
            Key: {
                pk: DashboardFactory.itemId(dashboardId),
                sk: DashboardFactory.itemId(dashboardId),
            },
        });
        return DashboardFactory.fromItem(result.Item as DashboardItem);
    }

    public async putDashboard(dashboard: Dashboard) {
        await this.dynamodb.put({
            TableName: this.tableName,
            Item: DashboardFactory.toItem(dashboard),
        });
    }

    /**
     * Returns all Dashboards by performing a query
     * operation against the `byType` Global Secondary Index
     * on the DynamoDB table.
     *
     * TODO: Implement pagination
     */
    public async listDashboards(): Promise<DashboardList> {
        const result = await this.dynamodb.query({
            TableName: this.tableName,
            IndexName: "byType",
            KeyConditionExpression: "#type = :type",
            ExpressionAttributeNames: {
                "#type": "type",
            },
            ExpressionAttributeValues: {
                ":type": "Dashboard",
            },
        });

        if (!result.Items) {
            return [];
        }

        return result.Items.map((item) => DashboardFactory.fromItem(item as DashboardItem));
    }

    public async getDashboardVersions(parentDashboardId: string): Promise<DashboardList> {
        const result = await this.dynamodb.query({
            TableName: this.tableName,
            IndexName: "byParentDashboard",
            KeyConditionExpression: "parentDashboardId = :parentDashboardId",
            ExpressionAttributeValues: {
                ":parentDashboardId": parentDashboardId,
            },
        });

        if (!result.Items || result.Items.length === 0) {
            return [];
        }

        return result.Items.map((item) => DashboardFactory.fromItem(item as DashboardItem));
    }

    public async getNextVersionNumber(parentDashboardId: string): Promise<number> {
        const dashboards = await this.getDashboardVersions(parentDashboardId);
        if (dashboards.length === 0) {
            return 1;
        }

        const versions = dashboards
            .map((dashboard) => dashboard.version)
            .filter((version) => !isNaN(version));

        const latest = Math.max(...versions);
        return !isFinite(latest) ? 1 : latest + 1;
    }

    public async listDashboardsInTopicArea(topicAreaId: string): Promise<DashboardList> {
        const result = await this.dynamodb.query({
            TableName: this.tableName,
            IndexName: "byTopicArea",
            KeyConditionExpression: "#topicAreaId = :topicAreaId",
            ExpressionAttributeNames: {
                "#topicAreaId": "topicAreaId",
            },
            ExpressionAttributeValues: {
                ":topicAreaId": TopicAreaFactory.itemId(topicAreaId),
            },
        });

        if (!result.Items) {
            return [];
        }

        const items = result.Items.filter((item) => item.type === "Dashboard");
        return items.map((item) => DashboardFactory.fromItem(item as DashboardItem));
    }

    /**
     * Updates a Dashboard identified by the param `dashboard`. Sets
     * the `updatedBy` field to the userId doing the update action.
     */
    public async updateDashboard(
        dashboardId: string,
        name: string,
        topicAreaId: string,
        topicAreaName: string,
        displayTableOfContents: boolean,
        tableOfContents: any,
        description: string,
        lastUpdatedAt: string,
        user: User,
    ) {
        try {
            await this.dynamodb.update({
                TableName: this.tableName,
                Key: {
                    pk: DashboardFactory.itemId(dashboardId),
                    sk: DashboardFactory.itemId(dashboardId),
                },
                UpdateExpression:
                    "set #dashboardName = :dashboardName, #topicAreaId = :topicAreaId, " +
                    "#topicAreaName = :topicAreaName, #displayTableOfContents = :displayTableOfContents, " +
                    "#description = :description, #updatedAt = :updatedAt, #updatedBy = :userId, " +
                    "#tableOfContents = :tableOfContents",
                ConditionExpression: "#updatedAt <= :lastUpdatedAt",
                ExpressionAttributeValues: {
                    ":dashboardName": name,
                    ":topicAreaId": TopicAreaFactory.itemId(topicAreaId),
                    ":topicAreaName": topicAreaName,
                    ":displayTableOfContents": displayTableOfContents,
                    ":tableOfContents": tableOfContents,
                    ":description": description,
                    ":lastUpdatedAt": lastUpdatedAt,
                    ":updatedAt": new Date().toISOString(),
                    ":userId": user.userId,
                },
                ExpressionAttributeNames: {
                    "#dashboardName": "dashboardName",
                    "#topicAreaId": "topicAreaId",
                    "#topicAreaName": "topicAreaName",
                    "#displayTableOfContents": "displayTableOfContents",
                    "#tableOfContents": "tableOfContents",
                    "#description": "description",
                    "#updatedBy": "updatedBy",
                    "#updatedAt": "updatedAt",
                },
            });
        } catch (error) {
            if (error.code === "ConditionalCheckFailedException") {
                logger.warn(
                    "ConditionalCheckFailed when updating dashboard. Someone else updated the dashboard before us",
                    dashboardId,
                );
            }
            throw error;
        }
    }

    /**
     * Publish a Dashboard identified by the param `dashboardId`.
     */
    public async publishDashboard(
        dashboardId: string,
        parentDashboardId: string,
        lastUpdatedAt: string,
        releaseNotes: string,
        user: User,
        friendlyURL: string,
    ) {
        try {
            const transactions: DocumentClient.TransactWriteItemList = [];

            // If a published or archived version exists, move it to Inactive state
            const versions = await this.getDashboardVersions(parentDashboardId);
            const publishedOrArchived = versions.find(
                (version) =>
                    (version.state === DashboardState.Published ||
                        version.state === DashboardState.Archived) &&
                    version.id !== dashboardId, // excluding current dashboard being published
            );

            if (publishedOrArchived) {
                const publishedDashboardId = publishedOrArchived.id;
                transactions.push({
                    Update: {
                        TableName: this.tableName,
                        Key: {
                            pk: DashboardFactory.itemId(publishedDashboardId),
                            sk: DashboardFactory.itemId(publishedDashboardId),
                        },
                        UpdateExpression:
                            "set #state = :state, #updatedAt = :updatedAt, #updatedBy = :userId " +
                            "REMOVE #friendlyURL",
                        ExpressionAttributeValues: {
                            ":state": DashboardState.Inactive,
                            ":updatedAt": new Date().toISOString(),
                            ":userId": user.userId,
                        },
                        ExpressionAttributeNames: {
                            "#state": "state",
                            "#updatedBy": "updatedBy",
                            "#updatedAt": "updatedAt",
                            "#friendlyURL": "friendlyURL",
                        },
                    },
                });
            }

            //Set dashboard to Published state
            transactions.push({
                Update: {
                    TableName: this.tableName,
                    Key: {
                        pk: DashboardFactory.itemId(dashboardId),
                        sk: DashboardFactory.itemId(dashboardId),
                    },
                    UpdateExpression:
                        "set #state = :state, #updatedAt = :updatedAt, " +
                        "#releaseNotes = :releaseNotes, #updatedBy = :userId, " +
                        "#publishedBy = :userId, #friendlyURL = :friendlyURL",
                    ConditionExpression: "#updatedAt <= :lastUpdatedAt",
                    ExpressionAttributeValues: {
                        ":state": DashboardState.Published,
                        ":lastUpdatedAt": lastUpdatedAt,
                        ":releaseNotes": releaseNotes,
                        ":updatedAt": new Date().toISOString(),
                        ":userId": user.userId,
                        ":friendlyURL": friendlyURL,
                    },
                    ExpressionAttributeNames: {
                        "#state": "state",
                        "#updatedBy": "updatedBy",
                        "#publishedBy": "publishedBy",
                        "#releaseNotes": "releaseNotes",
                        "#updatedAt": "updatedAt",
                        "#friendlyURL": "friendlyURL",
                    },
                },
            });

            await this.dynamodb.transactWrite({
                TransactItems: transactions,
            });
        } catch (error) {
            if (error.code === "ConditionalCheckFailedException") {
                logger.warn(
                    "ConditionalCheckFailed when moving dashboard to published state",
                    dashboardId,
                );
            }
            throw error;
        }
    }

    /**
     * Set a Dashboard identified by the param `dashboardId` to publish pending state.
     * Returns the updated dashboard object.
     * @deprecated Removing the pending state from the dashboard
     */
    public async publishPendingDashboard(
        dashboardId: string,
        lastUpdatedAt: string,
        user: User,
        releaseNotes: string = "",
    ): Promise<Dashboard> {
        try {
            const result = await this.dynamodb.update({
                ReturnValues: "ALL_NEW",
                TableName: this.tableName,
                Key: {
                    pk: DashboardFactory.itemId(dashboardId),
                    sk: DashboardFactory.itemId(dashboardId),
                },
                UpdateExpression:
                    "set #state = :state, #updatedAt = :updatedAt, #updatedBy = :userId, " +
                    "#submittedBy = :userId, #releaseNotes = :releaseNotes",
                ConditionExpression: "#updatedAt <= :lastUpdatedAt",
                ExpressionAttributeValues: {
                    ":state": DashboardState.PublishPending,
                    ":lastUpdatedAt": lastUpdatedAt,
                    ":updatedAt": new Date().toISOString(),
                    ":userId": user.userId,
                    ":releaseNotes": releaseNotes,
                },
                ExpressionAttributeNames: {
                    "#state": "state",
                    "#updatedBy": "updatedBy",
                    "#submittedBy": "submittedBy",
                    "#updatedAt": "updatedAt",
                    "#releaseNotes": "releaseNotes",
                },
            });

            // Return the updated dashboard
            return DashboardFactory.fromItem(result.Attributes as DashboardItem);
        } catch (error) {
            if (error.code === "ConditionalCheckFailedException") {
                logger.warn(
                    "ConditionalCheckFailed when moving dashboard to publish pending state",
                    dashboardId,
                );
            }
            throw error;
        }
    }

    /**
     * Set a Dashboard identified by the param `dashboardId` to archived state.
     */
    public async archiveDashboard(dashboardId: string, lastUpdatedAt: string, user: User) {
        try {
            await this.dynamodb.update({
                TableName: this.tableName,
                Key: {
                    pk: DashboardFactory.itemId(dashboardId),
                    sk: DashboardFactory.itemId(dashboardId),
                },
                UpdateExpression:
                    "set #state = :state, #updatedAt = :updatedAt, #updatedBy = :userId, " +
                    "#archivedBy = :userId REMOVE #friendlyURL",
                ConditionExpression: "#updatedAt <= :lastUpdatedAt",
                ExpressionAttributeValues: {
                    ":state": DashboardState.Archived,
                    ":lastUpdatedAt": lastUpdatedAt,
                    ":updatedAt": new Date().toISOString(),
                    ":userId": user.userId,
                },
                ExpressionAttributeNames: {
                    "#state": "state",
                    "#updatedBy": "updatedBy",
                    "#archivedBy": "archivedBy",
                    "#updatedAt": "updatedAt",
                    "#friendlyURL": "friendlyURL",
                },
            });
        } catch (error) {
            if (error.code === "ConditionalCheckFailedException") {
                logger.warn("ConditionalCheckFailed when archiving dashboard %s", dashboardId);
            }
            throw error;
        }
    }

    /**
     * Set a Dashboard identified by the param `dashboardId` to draft state.
     */
    public async moveToDraft(dashboardId: string, lastUpdatedAt: string, user: User) {
        try {
            await this.dynamodb.update({
                TableName: this.tableName,
                Key: {
                    pk: DashboardFactory.itemId(dashboardId),
                    sk: DashboardFactory.itemId(dashboardId),
                },
                UpdateExpression:
                    "set #state = :state, #updatedAt = :updatedAt, #updatedBy = :userId, #submittedBy = :noUserId",
                ConditionExpression: "#updatedAt <= :lastUpdatedAt",
                ExpressionAttributeValues: {
                    ":state": DashboardState.Draft,
                    ":lastUpdatedAt": lastUpdatedAt,
                    ":updatedAt": new Date().toISOString(),
                    ":userId": user.userId,
                    ":noUserId": "",
                },
                ExpressionAttributeNames: {
                    "#state": "state",
                    "#updatedBy": "updatedBy",
                    "#submittedBy": "submittedBy",
                    "#updatedAt": "updatedAt",
                },
            });
        } catch (error) {
            if (error.code === "ConditionalCheckFailedException") {
                logger.warn(
                    "ConditionalCheckFailed when moving dashboard to draft state",
                    dashboardId,
                );
            }
            throw error;
        }
    }

    /**
     * Updates the updatedAt field. Sets the `updatedBy` field
     * to the userId doing the update action.
     */
    public async updateAt(dashboardId: string, user: User) {
        await this.dynamodb.update({
            TableName: this.tableName,
            Key: {
                pk: DashboardFactory.itemId(dashboardId),
                sk: DashboardFactory.itemId(dashboardId),
            },
            UpdateExpression: "set #updatedAt = :updatedAt, #updatedBy = :userId",
            ExpressionAttributeValues: {
                ":updatedAt": new Date().toISOString(),
                ":userId": user.userId,
            },
            ExpressionAttributeNames: {
                "#updatedBy": "updatedBy",
                "#updatedAt": "updatedAt",
            },
        });
    }

    /**
     * Deletes the Dashboard identified by the params
     * `dashboardId`.
     */
    public async delete(dashboardId: string) {
        await this.dynamodb.delete({
            TableName: this.tableName,
            Key: {
                pk: DashboardFactory.itemId(dashboardId),
                sk: DashboardFactory.itemId(dashboardId),
            },
        });
    }

    /**
     * Deletes the dashboards and widgets identified
     * by the params `ids`.
     */
    public async deleteDashboardsAndWidgets(dashboardIds: Array<string>, user: User) {
        let transactions: DocumentClient.TransactWriteItemList = [];

        const dashboards: DashboardList = [];
        for (let dashboardId of dashboardIds) {
            const dashboard = await this.getDashboardWithWidgets(dashboardId);

            if (dashboard.state !== DashboardState.Draft) {
                throw new InvalidState("Dashboard must be Draft to delete");
            }

            transactions.push({
                Update: {
                    TableName: this.tableName,
                    Key: {
                        pk: DashboardFactory.itemId(dashboardId),
                        sk: DashboardFactory.itemId(dashboardId),
                    },
                    UpdateExpression: "set #deletedBy = :userId",
                    ExpressionAttributeValues: {
                        ":userId": user.userId,
                    },
                    ExpressionAttributeNames: {
                        "#deletedBy": "deletedBy",
                    },
                },
            });
            dashboards.push(dashboard);
        }

        await this.dynamodb.transactWrite({
            TransactItems: transactions,
        });

        transactions = [];
        for (let dashboard of dashboards) {
            transactions.push({
                Delete: {
                    TableName: this.tableName,
                    Key: {
                        pk: DashboardFactory.itemId(dashboard.id),
                        sk: DashboardFactory.itemId(dashboard.id),
                    },
                },
            });

            if (dashboard.widgets) {
                dashboard.widgets.forEach((widget) => {
                    transactions.push({
                        Delete: {
                            TableName: this.tableName,
                            Key: {
                                pk: WidgetFactory.itemPk(dashboard.id),
                                sk: WidgetFactory.itemSk(widget.id),
                            },
                        },
                    });
                });
            }
        }

        await this.dynamodb.transactWrite({
            TransactItems: transactions,
        });
    }

    public async getDashboardWithWidgets(dashboardId: string): Promise<Dashboard> {
        const result = await this.dynamodb.query({
            TableName: this.tableName,
            KeyConditionExpression: "pk = :dashboardId",
            ExpressionAttributeValues: {
                ":dashboardId": DashboardFactory.itemId(dashboardId),
            },
        });

        if (!result.Items || result.Items.length === 0) {
            throw new ItemNotFound();
        }

        // Query returns multiple items, one of them is the master record
        // that represents the Dashboard item.
        const item = result.Items.find((item) => item.type === "Dashboard");
        const dashboard = DashboardFactory.fromItem(item as DashboardItem);

        // Parse the widgets and add them to the dashboard
        const items = result.Items.filter((item) => item.type === "Widget");
        dashboard.widgets = WidgetFactory.fromItems(items as Array<WidgetItem>);

        return dashboard;
    }

    public async listPublishedDashboards(): Promise<DashboardList> {
        const result = await this.dynamodb.query({
            TableName: this.tableName,
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

        if (!result.Items) {
            return [];
        }

        return result.Items.map((item) => DashboardFactory.fromItem(item as DashboardItem));
    }

    public async getCurrentDraft(parentDashboardId: string): Promise<Dashboard | null> {
        const result = await this.dynamodb.query({
            TableName: this.tableName,
            IndexName: "byParentDashboard",
            KeyConditionExpression: "parentDashboardId = :parentDashboardId",
            FilterExpression: "#state = :state",
            ExpressionAttributeNames: {
                "#state": "state",
            },
            ExpressionAttributeValues: {
                ":parentDashboardId": parentDashboardId,
                ":state": DashboardState.Draft,
            },
        });

        if (!result.Items || result.Items.length === 0) {
            return null;
        }

        return DashboardFactory.fromItem(result.Items[0] as DashboardItem);
    }

    public async saveDashboardAndWidgets(dashboard: Dashboard) {
        const transactions: DocumentClient.TransactWriteItemList = [];

        // Add the dashboard item to the transactions
        transactions.push({
            Put: {
                TableName: this.tableName,
                Item: DashboardFactory.toItem(dashboard),
            },
        });

        // Add widgets, if any
        if (dashboard.widgets) {
            dashboard.widgets.forEach((widget) => {
                transactions.push({
                    Put: {
                        TableName: this.tableName,
                        Item: WidgetFactory.toItem(widget),
                    },
                });
            });
        }

        await this.dynamodb.transactWrite({
            TransactItems: transactions,
        });
    }

    /**
     * Updates the topicAreaName on every dashboard in the list.
     * This function is invoked by the TopicArea repository whenever
     * a topic area is renamed.
     */
    public async updateTopicAreaName(
        dashboards: Array<Dashboard>,
        topicAreaName: string,
        user: User,
    ) {
        const updates: DocumentClient.TransactWriteItem[] = dashboards.map((dashboard) => ({
            Update: {
                TableName: this.tableName,
                Key: {
                    pk: DashboardFactory.itemId(dashboard.id),
                    sk: DashboardFactory.itemId(dashboard.id),
                },
                UpdateExpression: "set topicAreaName = :topicAreaName, #updatedBy = :updatedBy",
                ExpressionAttributeNames: {
                    "#updatedBy": "updatedBy",
                },
                ExpressionAttributeValues: {
                    ":topicAreaName": topicAreaName,
                    ":updatedBy": user.userId,
                },
            },
        }));

        await this.dynamodb.transactWrite({
            TransactItems: updates,
        });
    }

    /**
     * Finds a dashboard by its friendlyURL, if it exists. Otherwise
     * returns null if no dashboard is associated to the URL.
     */
    public async getDashboardByFriendlyURL(friendlyURL: string): Promise<Dashboard> {
        const result = await this.dynamodb.query({
            TableName: this.tableName,
            IndexName: "byFriendlyURL",
            KeyConditionExpression: "#friendlyURL = :friendlyURL",
            ExpressionAttributeNames: {
                "#friendlyURL": "friendlyURL",
            },
            ExpressionAttributeValues: {
                ":friendlyURL": friendlyURL,
            },
        });

        if (!result.Items || result.Items.length === 0) {
            logger.warn("No dashboard found for friendlyURL %s", friendlyURL);
            throw new ItemNotFound();
        }

        // In theory, there should never be more than 1 item with the same
        // friendlyURL. However, GSIs don't enforce uniqueness so we can
        // assume that result.Items will only have 1 item in the result set.
        const items = result.Items.filter((item) => item["type"] === "Dashboard");
        if (items.length === 0) {
            logger.warn("No dashboard found for friendlyURL %s", friendlyURL);
            throw new ItemNotFound();
        }

        return DashboardFactory.fromItem(items[0] as DashboardItem);
    }
}

export default DashboardRepository;
