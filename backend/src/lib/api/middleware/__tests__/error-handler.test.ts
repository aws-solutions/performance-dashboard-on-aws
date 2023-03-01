/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from "express";
import { ItemNotFound } from "../../../errors";
import errorHandler from "../error-handler";

const successfulRouteHandler = jest.fn(() => Promise.resolve());
const failedRouteHandler = jest.fn(() => Promise.reject(new Error()));

const req = {} as Request;
const res = {
    status: jest.fn() as any,
    send: jest.fn() as any,
} as Response;

describe("withErrorHandler", () => {
    it("calls the route handler", async () => {
        await errorHandler(successfulRouteHandler)(req, res);
        expect(successfulRouteHandler).toBeCalled();
    });

    it("handles error and returns a 500 error", async () => {
        console.error = jest.fn();
        await errorHandler(failedRouteHandler)(req, res);
        expect(res.status).toBeCalledWith(500);
        expect(res.send).toBeCalledWith("Internal server error");
    });

    it("handles ItemNotFound error and returns a 400 error", async () => {
        console.error = jest.fn();
        const itemNotFoundRouteHandler = jest.fn(() => Promise.reject(new ItemNotFound()));
        await errorHandler(itemNotFoundRouteHandler)(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Bad Request");
    });
});
