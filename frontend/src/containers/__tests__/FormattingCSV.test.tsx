/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FormattingCSV from "../FormattingCSV";

jest.mock("../../hooks");

beforeEach(() => {
    render(<FormattingCSV />, { wrapper: MemoryRouter });
});

test("renders the page title", async () => {
    const title = screen.getByRole("heading", {
        name: "Formatting CSV or Excel files",
    });
    expect(title).toBeInTheDocument();
});

test("renders a download link for line chart", async () => {
    expect(
        screen.getByRole("button", {
            name: "Download line chart example file",
        }),
    ).toBeInTheDocument();
});

test("renders a download link for column chart", async () => {
    expect(
        screen.getByRole("button", {
            name: "Download column chart example file",
        }),
    ).toBeInTheDocument();
});

test("renders a download link for part-to-whole", async () => {
    expect(
        screen.getByRole("button", {
            name: "Download part-to-whole chart example file",
        }),
    ).toBeInTheDocument();
});

test("renders a download link for table", async () => {
    expect(
        screen.getByRole("button", {
            name: "Download table example file",
        }),
    ).toBeInTheDocument();
});

test("renders a download link for pie chart", async () => {
    expect(
        screen.getByRole("button", {
            name: "Download pie chart example file",
        }),
    ).toBeInTheDocument();
});

test("renders a download link for donut chart", async () => {
    expect(
        screen.getByRole("button", {
            name: "Download donut chart example file",
        }),
    ).toBeInTheDocument();
});
