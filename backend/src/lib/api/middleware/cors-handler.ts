/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import cors from "cors";

const corsOrigin = process.env.CORS_ORIGIN ?? "*";

export const corsProtection = cors({
    origin: corsOrigin.split(","),
    credentials: true,
});
