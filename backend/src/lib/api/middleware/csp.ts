/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";

/**
 * Inject security related HTTP headers into the responses
 */
const csp = function (req: Request, res: Response, next: NextFunction) {
    res.set("Content-Security-Policy", "default-src 'self'; block-all-mixed-content;");
    res.set("Strict-Transport-Security", "max-age=31540000; includeSubdomains");
    res.set("X-XSS-Protection", "1; mode=block");
    res.set("X-Frame-Options", "DENY");
    res.set("X-Content-Type-Options", "nosniff");
    res.set("Cache-control", "no-cache");
    next();
};

export default csp;
