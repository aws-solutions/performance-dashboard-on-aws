/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { NextFunction, Request, Response } from "express";
import { doubleCsrf } from "csrf-csrf";
import cookieParser from "cookie-parser";

const csrfSecret = process.env.CSRF_SECRET ?? Math.random().toString();
const cookiesSecret = process.env.COOKIES_SECRET ?? Math.random().toString();

const { invalidCsrfTokenError, generateToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: () => csrfSecret,
    getTokenFromRequest: (req) => req.headers["x-csrf-token"],
    cookieName: "__Host-psifi.x-csrf-token",
    cookieOptions: {
        sameSite: "none",
        httpOnly: true,
        secure: true,
        signed: true,
        path: "/",
    },
    size: 64,
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
});

const csrfCookieParser = cookieParser(cookiesSecret);

const csrfErrorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error === invalidCsrfTokenError) {
        res.status(403);
        res.json({
            error: "csrf validation error",
        });
    } else {
        next();
    }
};

export {
    csrfCookieParser,
    csrfErrorHandler,
    doubleCsrfProtection,
    generateToken as generateCsrfToken,
};
