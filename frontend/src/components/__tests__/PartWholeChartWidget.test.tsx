/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PartWholeChartWidget from "../PartWholeChartWidget";

test("renders the chart title", async () => {
    render(
        <PartWholeChartWidget
            id="part-chart"
            title="test title"
            downloadTitle="test title"
            summary="test summary"
            parts={["Device", "Usage"]}
            summaryBelow={false}
            data={[
                { Device: "Mobile", Usage: 54 },
                { Device: "Tablet", Usage: 44 },
                { Device: "Desktop", Usage: 2 },
            ]}
            significantDigitLabels={false}
            columnsMetadata={[]}
        />,
        { wrapper: MemoryRouter },
    );
    expect(screen.getByText("test title")).toBeInTheDocument();
});

test("renders the summary above the chart", async () => {
    render(
        <PartWholeChartWidget
            id="part-chart"
            title="test title"
            downloadTitle="test title"
            summary="test summary"
            parts={["Device", "Usage"]}
            summaryBelow={false}
            data={[
                { Device: "Mobile", Usage: 54 },
                { Device: "Tablet", Usage: 44 },
                { Device: "Desktop", Usage: 2 },
            ]}
            significantDigitLabels={false}
            columnsMetadata={[]}
        />,
        { wrapper: MemoryRouter },
    );

    const summary = screen.getByText("test summary");
    expect(summary).toBeInTheDocument();
    expect(summary.closest("div")).toHaveClass("chartSummaryAbove");
});

test("renders the summary below the chart", async () => {
    render(
        <PartWholeChartWidget
            id="part-chart"
            title="test title"
            downloadTitle="test title"
            summary="test summary"
            parts={["Device", "Usage"]}
            summaryBelow={true}
            data={[
                { Device: "Mobile", Usage: 54 },
                { Device: "Tablet", Usage: 44 },
                { Device: "Desktop", Usage: 2 },
            ]}
            significantDigitLabels={false}
            columnsMetadata={[]}
        />,
        { wrapper: MemoryRouter },
    );

    const summary = screen.getByText("test summary");
    expect(summary).toBeInTheDocument();
    expect(summary.closest("div")).toHaveClass("chartSummaryBelow");
});
