/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { mocked } from "ts-jest/utils";
import { User } from "../../models/user";
import { Homepage, HomepageItem } from "../../models/homepage";
import HomepageRepository from "../homepage-repo";
import DynamoDBService from "../../services/dynamodb";
import S3Service from "../../services/s3";

jest.mock("../../services/dynamodb");
jest.mock("../../services/s3");
jest.mock("../../factories/dataset-factory");

let tableName: string;
let repo: HomepageRepository;
let dynamodb = mocked(DynamoDBService.prototype);
let s3Service = mocked(S3Service.prototype);
let user: User;

beforeAll(() => {
    user = { userId: "test" };
    tableName = "MainTable";
    process.env.MAIN_TABLE = tableName;

    DynamoDBService.getInstance = jest.fn().mockReturnValue(dynamodb);
    S3Service.getInstance = jest.fn().mockReturnValue(s3Service);
    repo = HomepageRepository.getInstance();
});

describe("getHomepage", () => {
    it("returns undefined if Homepage is not found", async () => {
        dynamodb.get = jest.fn().mockReturnValueOnce({ Item: null });
        const homepage = await repo.getHomepage();
        expect(homepage).toBeUndefined();
    });

    it("returns a Homepage if found on database", async () => {
        const item: HomepageItem = {
            pk: "Homepage",
            sk: "Homepage",
            type: "Homepage",
            title: "Kingdom of Wakanda",
            description: "Welcome to our kingdom",
        };

        dynamodb.get = jest.fn().mockReturnValueOnce({ Item: item });
        const homepage = (await repo.getHomepage()) as Homepage;

        expect(homepage.title).toEqual("Kingdom of Wakanda");
        expect(homepage.description).toEqual("Welcome to our kingdom");
    });
});

describe("updateHomepage", () => {
    it("should call updateItem with the correct keys", async () => {
        const now = new Date();
        await repo.updateHomepage("abc", "description test", now.toISOString(), user);
        expect(dynamodb.update).toHaveBeenCalledWith(
            expect.objectContaining({
                TableName: tableName,
                Key: {
                    pk: "Homepage",
                    sk: "Homepage",
                },
            }),
        );
    });

    it("should call update with all the fields", async () => {
        const now = new Date();
        jest.useFakeTimers("modern");
        jest.setSystemTime(now);
        await repo.updateHomepage("abc", "description test", now.toISOString(), user);
        expect(dynamodb.update).toHaveBeenCalledWith(
            expect.objectContaining({
                UpdateExpression:
                    "set #title = :title, #description = :description, #type = :type, #updatedAt = :updatedAt, #updatedBy = :userId",
                ExpressionAttributeValues: {
                    ":title": "abc",
                    ":description": "description test",
                    ":lastUpdatedAt": now.toISOString(),
                    ":updatedAt": now.toISOString(),
                    ":userId": user.userId,
                    ":type": "Homepage",
                },
            }),
        );
    });
});
