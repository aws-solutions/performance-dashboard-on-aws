/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { HomepageItem } from "../../models/homepage";
import HomepageFactory from "../homepage-factory";
import { ItemNotFound } from "../../../lib/errors";
import { GetItemOutput } from "@aws-sdk/client-dynamodb";

describe("getDefaultHomepage", () => {
    it("returns default values", () => {
        expect(HomepageFactory.getDefaultHomepage()).toEqual({
            title: "Performance Dashboard",
            description:
                "The Performance Dashboard makes data open " +
                "and accessible to provide transparency and helps drive the " +
                "ongoing improvement of digital services.",
            updatedAt: expect.anything(),
        });
    });
});

describe("fromItem", () => {
    it("converts a dynamodb item to a Homepage object", () => {
        const item: HomepageItem = {
            pk: "Homepage",
            sk: "Homepage",
            type: "Homepage",
            title: "Kingdom of Wakanda",
            description: "Welcome to Wakanda",
        };

        const homepage = HomepageFactory.fromItem(item);
        expect(homepage.title).toEqual("Kingdom of Wakanda");
        expect(homepage.description).toEqual("Welcome to Wakanda");
    });

    it("converts a previously updated dynamodb item to a Homepage object", () => {
        const item: HomepageItem = {
            pk: "Homepage",
            sk: "Homepage",
            type: "Homepage",
            title: "Kingdom of Wakanda",
            description: "Welcome to Wakanda",
            updatedAt: "2023-02-15",
        };

        const homepage = HomepageFactory.fromItem(item);
        expect(homepage.title).toEqual("Kingdom of Wakanda");
        expect(homepage.description).toEqual("Welcome to Wakanda");
    });

    it("throws ItemNotFound when instance is not type of HomepageItem", () => {
        const result: GetItemOutput = {};
        expect(() => {
            HomepageFactory.fromItem(result.Item as unknown as HomepageItem);
        }).toThrowError(ItemNotFound);
    });
});
