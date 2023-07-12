/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Widget, WidgetItem, WidgetType } from "../models/widget";
import BaseRepository from "./base";
import WidgetFactory, { WIDGET_PREFIX, WIDGET_ITEM_TYPE } from "../factories/widget-factory";
import logger from "../services/logger";

class WidgetRepository extends BaseRepository {
    private static instance: WidgetRepository;
    private constructor() {
        super();
    }

    static getInstance(): WidgetRepository {
        if (!WidgetRepository.instance) {
            WidgetRepository.instance = new WidgetRepository();
        }

        return WidgetRepository.instance;
    }

    public async getWidgets(dashboardId: string): Promise<Widget[]> {
        const result = await this.dynamodb.query({
            TableName: this.tableName,
            KeyConditionExpression: "pk = :dashboardId and begins_with(sk, :sortKey)",
            ExpressionAttributeValues: {
                ":dashboardId": WidgetFactory.itemPk(dashboardId),
                ":sortKey": WIDGET_PREFIX,
            },
        });

        if (!result.Items) {
            return [];
        }

        const items = result.Items.filter((item) => item.type === WIDGET_ITEM_TYPE);
        return WidgetFactory.fromItems(items as WidgetItem[]);
    }

    public async getWidgetById(dashboardId: string, widgetId: string) {
        const result = await this.dynamodb.get({
            TableName: this.tableName,
            Key: {
                pk: WidgetFactory.itemPk(dashboardId),
                sk: WidgetFactory.itemSk(widgetId),
            },
        });
        return WidgetFactory.fromItem(result.Item as WidgetItem);
    }

    public async getAssociatedWidgets(datasetId: string): Promise<Widget[]> {
        const input: DocumentClient.QueryInput = {
            TableName: this.tableName,
            IndexName: "byType",
            KeyConditionExpression: "#type = :type",
            FilterExpression: "content.datasetId = :datasetId",
            ExpressionAttributeNames: {
                "#type": "type",
            },
            ExpressionAttributeValues: {
                ":type": "Widget",
                ":datasetId": datasetId,
            },
        };

        let result = await this.dynamodb.query(input);

        if (!result.Items) {
            return [];
        }

        let items = result.Items;

        while (result.LastEvaluatedKey) {
            input.ExclusiveStartKey = result.LastEvaluatedKey;
            result = await this.dynamodb.query(input);
            if (result.Items) {
                items = [
                    ...items,
                    ...result.Items.filter((item) => item.content.datasetId === datasetId),
                ];
            }
        }

        return WidgetFactory.fromItems(items as WidgetItem[]);
    }

    public async saveWidget(widget: Widget) {
        // Before saving new widget, need to determine the proper `order` for it.
        // by finding the last widget sorted by order.
        const widgets = await this.getWidgets(widget.dashboardId);
        if (widgets.length > 0) {
            const lastWidget = widgets.reduce((a, b) => (a.order > b.order ? a : b));
            widget.order = lastWidget.order + 1; // put this widget next to the last one
        }

        await this.dynamodb.put({
            TableName: this.tableName,
            Item: WidgetFactory.toItem(widget),
        });
    }

    public async updateWidget(updateRequest: {
        dashboardId: string;
        widgetId: string;
        name: string;
        content: any;
        lastUpdatedAt: Date;
        showTitle: boolean;
    }) {
        try {
            await this.dynamodb.update({
                TableName: this.tableName,
                Key: {
                    pk: WidgetFactory.itemPk(updateRequest.dashboardId),
                    sk: WidgetFactory.itemSk(updateRequest.widgetId),
                },
                UpdateExpression:
                    "set #name = :name, #content = :content, " +
                    "#updatedAt = :updatedAt, #showTitle = :showTitle",
                ConditionExpression: "#updatedAt <= :lastUpdatedAt",
                ExpressionAttributeValues: {
                    ":name": updateRequest.name,
                    ":content": updateRequest.content,
                    ":lastUpdatedAt": updateRequest.lastUpdatedAt.toISOString(),
                    ":updatedAt": new Date().toISOString(),
                    ":showTitle": updateRequest.showTitle,
                },
                ExpressionAttributeNames: {
                    "#name": "name",
                    "#content": "content",
                    "#updatedAt": "updatedAt",
                    "#showTitle": "showTitle",
                },
            });
        } catch (error: any) {
            if (error.code === "ConditionalCheckFailedException") {
                logger.warn(
                    "ConditionalCheckFailed on update widget=%s. Someone else updated the widget before us",
                    updateRequest.widgetId,
                );
            }
            throw error;
        }
    }

    public async deleteWidget(dashboardId: string, widgetId: string) {
        const widget = await this.getWidgetById(dashboardId, widgetId);
        const transactions: DocumentClient.TransactWriteItemList = [];

        if (widget.widgetType === WidgetType.Section && widget.content.widgetIds) {
            for (const id of widget.content.widgetIds) {
                transactions.push({
                    Delete: {
                        TableName: this.tableName,
                        Key: {
                            pk: WidgetFactory.itemPk(dashboardId),
                            sk: WidgetFactory.itemSk(id),
                        },
                    },
                });
            }
        }

        if (widget.section) {
            const section = await this.getWidgetById(dashboardId, widget.section);
            const content: any = section.content;
            if (content.widgetIds) {
                content.widgetIds = content.widgetIds.filter((wi: string) => wi !== widget.id);
                transactions.push({
                    Update: {
                        TableName: this.tableName,
                        Key: {
                            pk: WidgetFactory.itemPk(dashboardId),
                            sk: WidgetFactory.itemSk(section.id),
                        },
                        UpdateExpression: "set #content = :content",
                        ExpressionAttributeValues: {
                            ":content": content,
                        },
                        ExpressionAttributeNames: {
                            "#content": "content",
                        },
                    },
                });
            }
        }

        transactions.push({
            Delete: {
                TableName: this.tableName,
                Key: {
                    pk: WidgetFactory.itemPk(dashboardId),
                    sk: WidgetFactory.itemSk(widgetId),
                },
            },
        });

        await this.dynamodb.transactWrite({
            TransactItems: transactions,
        });
    }

    public async setWidgetOrder(
        dashboardId: string,
        widgets: Array<{
            id: string;
            order: number;
            updatedAt: string;
            content: any;
            section: string;
        }>,
    ) {
        const transactions: DocumentClient.TransactWriteItemList = widgets.map((widget) => ({
            Update: {
                TableName: this.tableName,
                Key: {
                    pk: WidgetFactory.itemPk(dashboardId),
                    sk: WidgetFactory.itemSk(widget.id),
                },
                UpdateExpression:
                    "set #order = :order, #content = :content, #section = :section, #updatedAt = :now",
                ConditionExpression: "#updatedAt <= :lastUpdated",
                ExpressionAttributeNames: {
                    "#order": "order",
                    "#updatedAt": "updatedAt",
                    "#content": "content",
                    "#section": "section",
                },
                ExpressionAttributeValues: {
                    ":order": widget.order,
                    ":now": new Date().toISOString(),
                    ":lastUpdated": widget.updatedAt,
                    ":content": widget.content,
                    ":section": widget.section || "",
                },
            },
        }));

        await this.dynamodb.transactWrite({ TransactItems: transactions });
    }
}

export default WidgetRepository;
