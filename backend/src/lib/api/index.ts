/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import cors from "cors";
import csp from "./middleware/csp";
import parserError from "./middleware/parser-error-handler";

import dashboard from "./dashboard-api";
import topicarea from "./topicarea-api";
import dataset from "./dataset-api";
import ingestapi from "./ingest-api";
import publicapi from "./public-api";
import settingsapi from "./settings-api";
import userapi from "./user-api";

const app = express();
app.use(express.json());
app.use(parserError);
app.use(cors());

app.use(csp);

app.use("/dashboard", dashboard);
app.use("/topicarea", topicarea);
app.use("/dataset", dataset);
app.use("/ingestapi", ingestapi);
app.use("/public", publicapi);
app.use("/settings", settingsapi);
app.use("/user", userapi);

export default app;
