/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { Role } from "../models/user";
import UserCtrl from "../controllers/user-ctrl";
import errorHandler from "./middleware/error-handler";
import auth from "./middleware/auth";
import rbac from "./middleware/rbac";

const router = Router();
router.use(auth);

router.get("/", rbac(Role.Admin), errorHandler(UserCtrl.getUsers));
router.post("/", rbac(Role.Admin), errorHandler(UserCtrl.addUsers));
router.delete("/", rbac(Role.Admin), errorHandler(UserCtrl.removeUsers));
router.post("/invite", rbac(Role.Admin), errorHandler(UserCtrl.resendInvite));
router.put("/role", rbac(Role.Admin), errorHandler(UserCtrl.changeRole));

export default router;
