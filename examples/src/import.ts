/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import prompts from "prompts";
import yargs from "yargs";
import { Configuration } from "./common";
import { availableResources } from "./services/fs-service";
import { importDashboard } from "./services/importer-service";
import { env } from "./env";

prompts.override(yargs.argv);

(async () => {
    console.log("Welcome to Performance Dashboard on AWS Import Tool");

    const { templateName, useDefaultConfig, author, reuseTopicArea, reuseDashboard, reuseDataset } =
        await prompts([
            {
                type: "select",
                name: "templateName",
                choices: availableResources().map((resource) => ({
                    title: resource,
                    value: resource,
                })),
                message: "Which template you want to install",
                initial: 0,
            },
            {
                type: "confirm",
                name: "useDefaultConfig",
                message: `Do you want to use the default config`,
                initial: true,
            },
            {
                type: (_prev, { useDefaultConfig }) => (useDefaultConfig ? null : "text"),
                name: "author",
                message: `Please specify the author doing the import`,
                validate: (value) => /^\S+@\S+\.\S+$/.test(value),
            },
            {
                type: (_prev, { useDefaultConfig }) => (useDefaultConfig ? null : "toggle"),
                name: "reuseTopicArea",
                message: `Do you want to reuse topic areas. System will reuse existing Ids to avoid duplication of topic areas.`,
                initial: true,
            },
            {
                type: (_prev, { useDefaultConfig }) => (useDefaultConfig ? null : "toggle"),
                name: "reuseDashboard",
                message: `Do you want to reuse dashboard. System will reuse existing Ids to avoid duplication of dashboards.`,
                initial: false,
            },
            {
                type: (_prev, { useDefaultConfig }) => (useDefaultConfig ? null : "toggle"),
                name: "reuseDataset",
                message: `Do you want to reuse datasets. System will reuse existing Ids to avoid duplication of datasets.`,
                initial: false,
            },
        ]);

    const config: Configuration = {
        example: templateName,
        author: author || env.USER_EMAIL,
        reuseTopicArea: reuseTopicArea === undefined ? true : reuseTopicArea,
        reuseDashboard: reuseDashboard === undefined ? false : reuseDashboard,
        reuseDataset: reuseDataset === undefined ? false : reuseDataset,
    };

    if (useDefaultConfig) {
        console.log("Using default config: {}", config);
    }

    try {
        await importDashboard(config);
    } catch (e) {
        console.error(e);
    }
})();
