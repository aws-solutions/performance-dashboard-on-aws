/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { User, Role } from "../../../models/user";
import rbac from "../rbac";

let req: any;
let res: any;
let next = jest.fn();
let user: User;

beforeEach(() => {
    req = {
        path: "/dashboard",
    };
    res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    user = {
        userId: "johndoe",
        roles: [],
    };
});

test("should return a 401 when user is not available", () => {
    rbac()(req, res, next);
    expect(res.status).toBeCalledWith(401);
    expect(res.send).toBeCalledWith("Unauthorized");
    expect(next).not.toBeCalled();
});

test("should return a 403 when user does not have role assigned", () => {
    user.roles = undefined;
    req.user = user;

    rbac()(req, res, next);

    expect(res.status).toBeCalledWith(403);
    expect(res.send).toBeCalledWith("User johndoe does not have a role assigned");
    expect(next).not.toBeCalled();
});

test("should return a 403 when user's roles are not allowed", () => {
    user.roles = [Role.Editor];
    req.user = user;

    const allowedRoles = [Role.Publisher];
    rbac(...allowedRoles)(req, res, next);

    expect(res.status).toBeCalledWith(403);
    expect(next).not.toBeCalled();
    expect(res.send).toBeCalledWith("User johndoe is not authorized to access /dashboard");
});

test("should return a 403 when no allowedRoles provided", () => {
    // Regardless if the user is an admin. If the rbac() middleware
    // specifies no allowed roles. The request should be denied.
    user.roles = [Role.Admin, Role.Editor, Role.Publisher];
    req.user = user;

    // No allowed roles
    rbac()(req, res, next);

    expect(res.status).toBeCalledWith(403);
    expect(next).not.toBeCalled();
    expect(res.send).toBeCalledWith("User johndoe is not authorized to access /dashboard");
});

test("should allow the user to proceed if it has the appropriate role", () => {
    user.roles = [Role.Admin, Role.Editor];
    req.user = user;

    const allowedRoles = [Role.Editor];
    rbac(...allowedRoles)(req, res, next);

    expect(next).toBeCalled();
    expect(res.send).not.toBeCalled();
});
