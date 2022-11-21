/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { Role } from "../models/user";
import TopicAreaCtrl from "../controllers/topicarea-ctrl";
import errorHandler from "./middleware/error-handler";
import auth from "./middleware/auth";
import rbac from "./middleware/rbac";

const router = Router();
router.use(auth);

router.get(
  "/",
  rbac(Role.Admin, Role.Editor),
  errorHandler(TopicAreaCtrl.listTopicAreas)
);

router.get(
  "/:id",
  rbac(Role.Admin, Role.Editor),
  errorHandler(TopicAreaCtrl.getTopicAreaById)
);

router.post("/", rbac(Role.Admin), errorHandler(TopicAreaCtrl.createTopicArea));

router.put(
  "/:id",
  rbac(Role.Admin),
  errorHandler(TopicAreaCtrl.updateTopicArea)
);

router.delete(
  "/:id",
  rbac(Role.Admin),
  errorHandler(TopicAreaCtrl.deleteTopicArea)
);

export default router;
