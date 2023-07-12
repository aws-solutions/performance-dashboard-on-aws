/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import DynamoDBService from "../services/dynamodb";

abstract class BaseRepository {
    protected dynamodb: DynamoDBService;
    protected tableName: string;

    constructor() {
        if (!process.env.MAIN_TABLE) {
            throw new Error("Environment variable MAIN_TABLE not found");
        }

        this.dynamodb = DynamoDBService.getInstance();
        this.tableName = process.env.MAIN_TABLE;
    }
}

export default BaseRepository;
