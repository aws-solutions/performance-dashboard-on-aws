/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import DashboardRepository from "performance-dashboard-backend/src/lib/repositories/dashboard-repo";
import DatasetRepository from "performance-dashboard-backend/src/lib/repositories/dataset-repo";
import { DashboardSnapshot } from "../common";
import { writeSnapshot } from "./fs-service";
import { downloadResource } from "./s3-service";

export async function exportDashboard(name: string, dashboardId: string) {
    console.log("exporting dashboard: {}", dashboardId);
    const snapshot: DashboardSnapshot = {
        dashboard: await DashboardRepository.getInstance().getDashboardWithWidgets(dashboardId),
        datasets: [],
    };

    if (!snapshot.dashboard) {
        throw new Error(`Dashboard ${dashboardId} not found`);
    }

    console.log("sorting widgets");
    if (!snapshot.dashboard.widgets) {
        snapshot.dashboard.widgets = [];
    }
    snapshot.dashboard.widgets = snapshot.dashboard.widgets?.sort((a, b) => {
        return a.order < b.order ? -1 : a.order > b.order ? 1 : 0;
    });

    for (const widget of snapshot.dashboard.widgets) {
        if (!widget.content?.datasetId) {
            console.log("widget don't have dataset: {}", widget.id);
            continue;
        }

        console.log("exporting dataset: {}", widget.content?.datasetId);
        const dataset = await DatasetRepository.getInstance().getDatasetById(
            widget.content.datasetId,
        );
        if (!dataset) {
            throw new Error(`Dataset ${widget.content.datasetId} not found`);
        }

        if (widget.content?.s3Key?.json) {
            console.log("exporting resource: {}", widget.content.s3Key.json);
            await downloadResource(name, widget.content.s3Key.json);
        }
        if (
            widget.content?.s3Key?.raw &&
            widget.content.s3Key.yaw !== widget.content?.s3Key?.json
        ) {
            console.log("exporting resource: {}", widget.content.s3Key.raw);
            await downloadResource(name, widget.content.s3Key.raw);
        }

        snapshot.datasets.push(dataset);
    }

    snapshot.dashboard.parentDashboardId = snapshot.dashboard.id;
    snapshot.dashboard.createdBy = "<system>";
    snapshot.dashboard.updatedBy = "";
    writeSnapshot(name, snapshot);
    console.log("exported dashboard: {}", dashboardId);
    return snapshot;
}
