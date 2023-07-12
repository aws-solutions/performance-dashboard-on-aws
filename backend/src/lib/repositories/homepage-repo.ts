/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { User } from "../models/user";
import { Homepage, HomepageItem } from "../models/homepage";
import HomepageFactory from "../factories/homepage-factory";
import BaseRepository from "./base";
import logger from "../services/logger";

class HomepageRepository extends BaseRepository {
    protected static instance: HomepageRepository;
    private constructor() {
        super();
    }

    static getInstance(): HomepageRepository {
        if (!HomepageRepository.instance) {
            HomepageRepository.instance = new HomepageRepository();
        }

        return HomepageRepository.instance;
    }

    public async getHomepage(): Promise<Homepage | undefined> {
        const result = await this.dynamodb.get({
            TableName: this.tableName,
            Key: {
                pk: "Homepage",
                sk: "Homepage",
            },
        });

        if (!result.Item) {
            return undefined;
        }

        return HomepageFactory.fromItem(result.Item as HomepageItem);
    }

    /**
     * Updates the homepage title and description
     */
    public async updateHomepage(
        title: string,
        description: string,
        lastUpdatedAt: string,
        user: User,
    ) {
        try {
            await this.dynamodb.update({
                TableName: this.tableName,
                Key: {
                    pk: "Homepage",
                    sk: "Homepage",
                },
                UpdateExpression:
                    "set #title = :title, #description = :description, #type = :type, #updatedAt = :updatedAt, #updatedBy = :userId",
                ConditionExpression:
                    "attribute_not_exists(#updatedAt) or #updatedAt <= :lastUpdatedAt",
                ExpressionAttributeValues: {
                    ":title": title,
                    ":description": description,
                    ":lastUpdatedAt": lastUpdatedAt,
                    ":updatedAt": new Date().toISOString(),
                    ":userId": user.userId,
                    ":type": "Homepage",
                },
                ExpressionAttributeNames: {
                    "#title": "title",
                    "#description": "description",
                    "#updatedBy": "updatedBy",
                    "#updatedAt": "updatedAt",
                    "#type": "type",
                },
            });
        } catch (error: any) {
            if (error.code === "ConditionalCheckFailedException") {
                logger.warn(
                    "ConditionalCheckFailed on update homepage=%s. Someone else updated the homepage before us",
                    title,
                );
            }
            throw error;
        }
    }
}

export default HomepageRepository;
