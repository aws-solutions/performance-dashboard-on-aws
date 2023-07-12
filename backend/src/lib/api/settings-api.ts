/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { Role } from "../models/user";
import SettingsCtrl from "../controllers/settings-ctrl";
import errorHandler from "./middleware/error-handler";
import HomepageCtrl from "../controllers/homepage-ctrl";
import auth from "./middleware/auth";
import rbac from "./middleware/rbac";

const router = Router();
router.use(auth);

router.get("/", errorHandler(SettingsCtrl.getSettings));
router.put("/", rbac(Role.Admin), errorHandler(SettingsCtrl.updateSettings));

router.get("/homepage", rbac(Role.Admin, Role.Editor), errorHandler(HomepageCtrl.getHomepage));

router.put("/homepage", rbac(Role.Admin), errorHandler(HomepageCtrl.updateHomepage));

export default router;
