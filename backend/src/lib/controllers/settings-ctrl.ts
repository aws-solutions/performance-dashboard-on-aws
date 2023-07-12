/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from "express";
import SettingsFactory from "../factories/settings-factory";
import SettingsRepository from "../repositories/settings-repo";

async function getSettings(req: Request, res: Response) {
    const repo = SettingsRepository.getInstance();
    const settings = await repo.getSettings();

    return res.json(settings);
}

function validateSetting(settingName: string, settingValue: any): string | null {
    switch (settingName) {
        case "dateTimeFormat":
            if (!settingValue.date || !settingValue.time) {
                return "Missing fields `date` or `time` in dateTimeFormat";
            }
            return null;
        case "topicAreaLabels":
            if (!settingValue.singular || !settingValue.plural) {
                return "Missing fields `singular` or `plural` in topicAreaLabels";
            }
            return null;
        case "colors":
            if (!settingValue.primary || !settingValue.secondary) {
                return "Missing fields `primary` or `secondary` in colors";
            }
            return null;
        default:
            return null;
    }
}

async function updateSettings(req: Request, res: Response) {
    const user = req.user;
    let { updatedAt } = req.body;

    if (!updatedAt) {
        res.status(400);
        return res.send("Missing field `updatedAt` in body");
    }

    const settingNames = [
        "publishingGuidance",
        "dateTimeFormat",
        "navbarTitle",
        "topicAreaLabels",
        "customLogoS3Key",
        "customLogoAltText",
        "customFaviconS3Key",
        "colors",
        "adminContactEmailAddress",
        "contactEmailAddress",
        "contactUsContent",
        "analyticsTrackingId",
    ];

    const repo = SettingsRepository.getInstance();

    for (const settingName of settingNames) {
        const settingValue = req.body[settingName];
        if (settingValue) {
            const errorMessage = validateSetting(settingName, settingValue);
            if (errorMessage) {
                return res.status(400).send(errorMessage);
            }
            updatedAt = await repo.updateSetting(settingName, settingValue, updatedAt, user);
        }
    }

    res.send();
}

async function getPublicSettings(req: Request, res: Response) {
    const repo = SettingsRepository.getInstance();
    const settings = await repo.getSettings();

    const publicSettings = SettingsFactory.toPublicSettings(settings);
    return res.json(publicSettings);
}

export default {
    getSettings,
    getPublicSettings,
    updateSettings,
};
