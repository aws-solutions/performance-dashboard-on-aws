/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PieChartWidget from "../PieChartWidget";

test("renders the chart title", async () => {
    render(
        <PieChartWidget
            id="pie-chart"
            title="test title"
            downloadTitle="test title"
            summary="test summary"
            parts={["test"]}
            summaryBelow={false}
            data={[{}]}
            significantDigitLabels={false}
            columnsMetadata={[]}
        />,
        { wrapper: MemoryRouter },
    );
    expect(screen.getByText("test title")).toBeInTheDocument();
});

test("renders the summary above the chart", async () => {
    render(
        <PieChartWidget
            id="pie-chart"
            title="test title"
            downloadTitle="test title"
            summary="test summary"
            parts={["test"]}
            summaryBelow={false}
            data={[{}]}
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
        <PieChartWidget
            id="pie-chart"
            title="test title"
            downloadTitle="test title"
            summary="test summary"
            parts={["test"]}
            summaryBelow={true}
            data={[{}]}
            significantDigitLabels={false}
            columnsMetadata={[]}
        />,
        { wrapper: MemoryRouter },
    );

    const summary = screen.getByText("test summary");
    expect(summary).toBeInTheDocument();
    expect(summary.closest("div")).toHaveClass("chartSummaryBelow");
});
