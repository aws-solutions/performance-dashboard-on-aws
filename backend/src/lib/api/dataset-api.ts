/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { Role } from "../models/user";
import DatasetCtrl from "../controllers/dataset-ctrl";
import errorHandler from "./middleware/error-handler";
import auth from "./middleware/auth";
import rbac from "./middleware/rbac";

const router = Router();
router.use(auth);

router.get(
  "/",
  rbac(Role.Admin, Role.Editor),
  errorHandler(DatasetCtrl.listDatasets)
);

router.get(
  "/:id",
  rbac(Role.Admin, Role.Editor),
  errorHandler(DatasetCtrl.getDatasetById)
);

router.post(
  "/",
  rbac(Role.Admin, Role.Editor),
  errorHandler(DatasetCtrl.createDataset)
);

export default router;
