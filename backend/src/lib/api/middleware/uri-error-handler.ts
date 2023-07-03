/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { NextFunction, Request, Response } from "express";

/**
 * Catch URIError: Failed to decode param
 */
const uriErrorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error && error instanceof URIError) {
        res.status(400);
        res.send("Bad Request");
    } else {
        next();
    }
};

export default uriErrorHandler;
