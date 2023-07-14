/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { SettingsItem, Settings } from "../../models/settings";
import SettingsFactory from "../settings-factory";
import { ItemNotFound } from "../../../lib/errors";
import { GetItemOutput } from "aws-sdk/clients/dynamodb";

describe("getDefaultSettings", () => {
    it("returns default values", () => {
        expect(SettingsFactory.getDefaultSettings()).toEqual({
            updatedAt: expect.anything(),
            dateTimeFormat: {
                date: "YYYY-MM-DD",
                time: "HH:mm",
            },
            publishingGuidance:
                "I acknowledge that I have reviewed the dashboard and it is ready to publish",
            navbarTitle: "Performance Dashboard",
            topicAreaLabels: {
                singular: "Topic Area",
                plural: "Topic Areas",
            },
            customLogoS3ID: undefined,
            colors: {
                primary: "#005EA2",
                secondary: "#54278f",
            },
            analyticsTrackingId: undefined,
        });
    });
});

describe("fromItem", () => {
    it("converts a dynamodb item to a Settings object", () => {
        const item: SettingsItem = {
            pk: "Settings",
            sk: "Settings",
            type: "Settings",
            dateTimeFormat: {
                date: "YYYY-MM-DD",
                time: "HH:mm",
            },
            publishingGuidance: "I acknowledge foo is equal to bar",
            updatedAt: "2020-12-09T17:21:42.823Z",
            navbarTitle: "Performance Dashboard",
            topicAreaLabels: {
                singular: "Topic Area",
                plural: "Topic Areas",
            },
            customLogoS3Key: "12345",
            customLogoAltText: "Alt text",
            customFaviconS3Key: "12345",
            colors: {
                primary: "#005EA2",
                secondary: "#54278f",
            },
            contactEmailAddress: "test@example.com",
            adminContactEmailAddress: "admin@example.com",
            contactUsContent: "test content",
            analyticsTrackingId: "UA123",
        };

        const settings = SettingsFactory.fromItem(item);
        expect(settings).toEqual({
            publishingGuidance: "I acknowledge foo is equal to bar",
            dateTimeFormat: {
                date: "YYYY-MM-DD",
                time: "HH:mm",
            },
            updatedAt: new Date("2020-12-09T17:21:42.823Z"),
            navbarTitle: "Performance Dashboard",
            topicAreaLabels: {
                singular: "Topic Area",
                plural: "Topic Areas",
            },
            customLogoS3Key: "12345",
            customLogoAltText: "Alt text",
            customFaviconS3Key: "12345",
            colors: {
                primary: "#005EA2",
                secondary: "#54278f",
            },
            contactEmailAddress: "test@example.com",
            adminContactEmailAddress: "admin@example.com",
            contactUsContent: "test content",
            analyticsTrackingId: "UA123",
        });
    });

    it("converts a dynamodb object without optional properties item to a Settings object", () => {
        const item: SettingsItem = {
            pk: "Settings",
            sk: "Settings",
            type: "Settings",
            updatedAt: "2020-12-09T17:21:42.823Z",
            customLogoS3Key: undefined,
            customLogoAltText: undefined,
            customFaviconS3Key: undefined,
        };

        const settings = SettingsFactory.fromItem(item);
        expect(settings).toEqual({
            publishingGuidance:
                "I acknowledge that I have reviewed " + "the dashboard and it is ready to publish",
            dateTimeFormat: {
                date: "YYYY-MM-DD",
                time: "HH:mm",
            },
            updatedAt: new Date("2020-12-09T17:21:42.823Z"),
            navbarTitle: "Performance Dashboard",
            topicAreaLabels: {
                singular: "Topic Area",
                plural: "Topic Areas",
            },
            customLogoS3Key: undefined,
            customLogoAltText: undefined,
            customFaviconS3Key: undefined,
            colors: {
                primary: "#005EA2",
                secondary: "#54278f",
            },
            contactEmailAddress: undefined,
            adminContactEmailAddress: undefined,
            contactUsContent: undefined,
            analyticsTrackingId: undefined,
        });
    });

    it("throws ItemNotFound when instance is not type of SettingsFactory", () => {
        const result: GetItemOutput = {};
        expect(() => {
            SettingsFactory.fromItem(result.Item as unknown as SettingsItem);
        }).toThrowError(ItemNotFound);
    });
});

describe("toPublicSettings", () => {
    it("removes values that should not be public", () => {
        const settings: Settings = {
            updatedAt: new Date(),
            publishingGuidance: "foo=bar",
            dateTimeFormat: {
                date: "MMM, YYY",
                time: "hh:mm",
            },
            navbarTitle: "Performance Dashboard",
            topicAreaLabels: {
                singular: "Topic Area",
                plural: "Topic Areas",
            },
            customLogoS3Key: "12345",
            customLogoAltText: "Alt text",
            customFaviconS3Key: "12345",
            colors: {
                primary: "#ffffff",
                secondary: "#ffffff",
            },
            contactEmailAddress: "test@example.com",
            contactUsContent: "test content",
            analyticsTrackingId: "UA123",
        };

        const publicSettings = SettingsFactory.toPublicSettings(settings);
        expect(publicSettings).toEqual({
            dateTimeFormat: {
                date: "MMM, YYY",
                time: "hh:mm",
            },
            navbarTitle: "Performance Dashboard",
            topicAreaLabels: {
                singular: "Topic Area",
                plural: "Topic Areas",
            },
            customLogoS3Key: "12345",
            customFaviconS3Key: "12345",
            colors: {
                primary: "#ffffff",
                secondary: "#ffffff",
            },
            contactEmailAddress: "test@example.com",
            contactUsContent: "test content",
            analyticsTrackingId: "UA123",
        });
    });
    it("convert missing values that must be public", () => {
        const settings: Settings = {
            updatedAt: new Date(),
            customLogoS3Key: undefined,
            customLogoAltText: undefined,
            customFaviconS3Key: undefined,
            publishingGuidance: "foo=bar",
            dateTimeFormat: {
                date: "MMM, YYY",
                time: "hh:mm",
            },
            navbarTitle: "Performance Dashboard",
            topicAreaLabels: {
                singular: "Topic Area",
                plural: "Topic Areas",
            },
        };

        const publicSettings = SettingsFactory.toPublicSettings(settings);
        expect(publicSettings).toEqual({
            dateTimeFormat: {
                date: "MMM, YYY",
                time: "hh:mm",
            },
            navbarTitle: "Performance Dashboard",
            topicAreaLabels: {
                singular: "Topic Area",
                plural: "Topic Areas",
            },
            customLogoS3Key: undefined,
            customFaviconS3Key: undefined,
            colors: {
                primary: "#005EA2",
                secondary: "#54278f",
            },
            contactEmailAddress: undefined,
            contactUsContent: undefined,
            analyticsTrackingId: undefined,
        });
    });
});
