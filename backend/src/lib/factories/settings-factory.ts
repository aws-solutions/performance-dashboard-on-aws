/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Settings, PublicSettings, SettingsItem } from "../models/settings";
import { ItemNotFound } from "../errors";

function getDefaultSettings(): Settings {
    return {
        updatedAt: new Date(),
        dateTimeFormat: {
            date: "YYYY-MM-DD",
            time: "HH:mm",
        },
        publishingGuidance:
            "I acknowledge that I have reviewed " + "the dashboard and it is ready to publish",
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
        analyticsTrackingId: undefined,
    };
}

function fromItem(item: SettingsItem): Settings {
    if (!item) {
        throw new ItemNotFound();
    }
    const defaults = getDefaultSettings();
    return {
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : defaults.updatedAt,
        publishingGuidance: item.publishingGuidance
            ? item.publishingGuidance
            : defaults.publishingGuidance,
        dateTimeFormat: item.dateTimeFormat ? item.dateTimeFormat : defaults.dateTimeFormat,
        navbarTitle: item.navbarTitle ? item.navbarTitle : defaults.navbarTitle,
        topicAreaLabels: item.topicAreaLabels ? item.topicAreaLabels : defaults.topicAreaLabels,
        customLogoS3Key: item.customLogoS3Key ? item.customLogoS3Key : defaults.customLogoS3Key,
        customLogoAltText: item.customLogoAltText
            ? item.customLogoAltText
            : defaults.customLogoAltText,
        customFaviconS3Key: item.customFaviconS3Key
            ? item.customFaviconS3Key
            : defaults.customFaviconS3Key,
        colors: item.colors ? item.colors : defaults.colors,
        contactEmailAddress: item.contactEmailAddress,
        adminContactEmailAddress: item.adminContactEmailAddress,
        contactUsContent: item.contactUsContent,
        analyticsTrackingId: item.analyticsTrackingId
            ? item.analyticsTrackingId
            : defaults.analyticsTrackingId,
    };
}

function toPublicSettings(settings: Settings): PublicSettings {
    const defaults = getDefaultSettings();
    return {
        dateTimeFormat: settings.dateTimeFormat ? settings.dateTimeFormat : defaults.dateTimeFormat,
        navbarTitle: settings.navbarTitle ? settings.navbarTitle : defaults.navbarTitle,
        topicAreaLabels: settings.topicAreaLabels
            ? settings.topicAreaLabels
            : defaults.topicAreaLabels,
        customLogoS3Key: settings.customLogoS3Key
            ? settings.customLogoS3Key
            : defaults.customLogoS3Key,
        customFaviconS3Key: settings.customFaviconS3Key
            ? settings.customFaviconS3Key
            : defaults.customFaviconS3Key,
        colors: settings.colors ? settings.colors : defaults.colors,
        contactEmailAddress: settings.contactEmailAddress,
        contactUsContent: settings.contactUsContent,
        analyticsTrackingId: settings.analyticsTrackingId
            ? settings.analyticsTrackingId
            : defaults.analyticsTrackingId,
    };
}

export default {
    getDefaultSettings,
    fromItem,
    toPublicSettings,
};
