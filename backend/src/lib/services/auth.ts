/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Request } from "express";
import { User, Role } from "../models/user";

function isLocalMode() {
    return !!process.env.LOCAL_MODE || false;
}

/**
 * Gets the logged-in user from the http request headers.
 * Returns null if no user is found.
 * Returns dummy user if running in local mode.
 */
function getCurrentUser(req: Request): User | null {
    if (isLocalMode()) {
        return userFromClaims(dummyUser());
    }

    /**
     * When running on Lambda behind API Gateway, Cognito user claims
     * are in the x-apigateway-event header inside requestContext.authorizer.
     */
    const event = req.headers["x-apigateway-event"] as string;
    if (!event) {
        throw new Error("Unable to find current user due to missing x-apigateway-event header");
    }

    const apigw = JSON.parse(decodeURIComponent(event));
    const requestContext = apigw.requestContext;
    if (!requestContext.authorizer) {
        return null; // No user information found
    }

    const { claims } = requestContext.authorizer;
    return userFromClaims(claims);
}

function userFromClaims(claims: any): User {
    /**
     * Claims include the standard OIDC claims plus additional ones
     * added by Cognito with the prefix cognito:{attribute}.
     *
     * https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
     */
    let roles: Array<Role> = [];
    if (claims["custom:roles"]) {
        try {
            roles = JSON.parse(claims["custom:roles"]);
        } catch (err) {
            console.error("Invalid value for custom:roles in JWT token claims", err);
        }
    }

    return {
        userId: claims["cognito:username"],
        roles,
    };
}

function dummyUser(): any {
    return {
        sub: "c077a68a-de21-47c6-a119-9e3449b52edd",
        aud: "1nscgv46llpouam1cvnskjrl42",
        email_verified: "true",
        event_id: "5e28a777-c4c7-43d3-a1cf-d38536728248",
        token_use: "id",
        auth_time: "1595027153",
        iss: "https://cognito-idp.us-west-2.amazonaws.com/us-west-2_JRVEBvlNZ",
        "cognito:username": "johndoe",
        exp: "Sat Jul 18 00:05:53 UTC 2020",
        iat: "Fri Jul 17 23:05:54 UTC 2020",
        email: "johndoe@example.com",
        "custom:roles": '["Admin"]',
    };
}

export default {
    getCurrentUser,
};
