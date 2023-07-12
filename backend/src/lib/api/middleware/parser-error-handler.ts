/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";

/**
 * Catch parser error
 */
const parserError = function (err: Error | null, req: Request, res: Response, next: NextFunction) {
    if (err instanceof SyntaxError && err.message.includes("JSON")) {
        res.status(400);
        res.send("Bad JSON");
    } else {
        next();
    }
};

export default parserError;
