/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { Role } from "../../models/user";

/**
 * Role-based access control (RBAC) middleware.
 * Assumes that the `auth` middleware has already placed
 * the user in the Request object.
 */
const rbac = (...allowedRoles: Role[]) =>
  function (req: Request, res: Response, next: NextFunction) {
    const user = req.user;
    if (!user) {
      // This technically should not happen. If the request got
      // all the way to this middleware, the user should already
      // be in the request object. But just in case ...
      return res.status(401).send("Unauthorized");
    }

    if (!user.roles) {
      return res
        .status(403)
        .send(`User ${user.userId} does not have a role assigned`);
    }

    // Get the intersection of the Allowed Roles and the user's roles.
    // i.e. User has roles [A,B] and AllowedRoles are [B].
    // Intersection should return B, hence the request should be allowed.
    const intersection = user.roles.filter((role) =>
      allowedRoles.includes(role)
    );

    if (intersection.length === 0) {
      return res
        .status(403)
        .send(`User ${user.userId} is not authorized to access ${req.path}`);
    }

    next();
  };

export default rbac;
