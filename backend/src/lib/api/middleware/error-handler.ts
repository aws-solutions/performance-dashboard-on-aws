/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from "express";
import { ItemNotFound } from "../../errors/index";

/**
 * Wrapper for our route handlers to serve as a catch-all for unexpected
 * exceptions thrown at runtime. This is needed because Express.js will not
 * catch exceptions thrown in async handlers and if that happens, the request
 * hangs until it eventually times out which creates a bad UX.
 *
 * The alternative to this is to wrap every controller function in a
 * try/catch block, which is repetitive and not ideal.
 *
 * This function is not meant for catching expected exceptions. i.e. Input
 * validation or access denied errors should be handled gracefully by
 * the controllers and return appropriate HTTP status codes.
 */
const errorHandler = (fn: Function) => async (req: Request, res: Response) => {
    Promise.resolve(fn(req, res)).catch((err) => {
        console.error(err);

        if (err instanceof ItemNotFound || err.statusCode === 400) {
            res.status(400);
            res.send("Bad Request");
        } else {
            res.status(500);
            res.send("Internal server error");
        }
    });
};

export default errorHandler;
