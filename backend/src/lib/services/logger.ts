/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import pino from "pino";

const logLevel = process.env.LOG_LEVEL || "info";
const logger = pino({
    level: logLevel.toLocaleLowerCase(),
    base: null,
});

export default logger;
