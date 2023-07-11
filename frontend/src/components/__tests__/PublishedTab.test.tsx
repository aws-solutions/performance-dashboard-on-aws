/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, fireEvent, act, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PublishedTab from "../PublishedTab";
import { Dashboard } from "../../models";

jest.mock("../../hooks");

const dashboards: Array<Dashboard> = [
    {
        id: "abc",
        name: "Dashboard One",
        version: 1,
        parentDashboardId: "abc",
        topicAreaId: "123456789",
        topicAreaName: "Topic Area Bananas",
        displayTableOfContents: false,
        createdBy: "test user",
        state: "Published",
        updatedAt: new Date(),
        widgets: [],
    },
    {
        id: "xyz",
        name: "Dashboard Two",
        version: 1,
        parentDashboardId: "xyz",
        topicAreaId: "987654321",
        topicAreaName: "Topic Area Grapes",
        displayTableOfContents: false,
        createdBy: "test user",
        state: "Published",
        updatedAt: new Date(),
        widgets: [],
    },
];

test("renders a button to archive", async () => {
    render(<PublishedTab dashboards={[]} onArchive={() => {}} onCopy={() => {}} />, {
        wrapper: MemoryRouter,
    });

    const actionsButton = screen.getByRole("button", {
        name: "Published dashboard actions",
    });
    fireEvent.click(actionsButton);

    const archiveButton = screen.getByText("Archive");
    expect(archiveButton).toBeInTheDocument();
});

test("renders a button to copy a dashboard", async () => {
    render(<PublishedTab dashboards={[]} onArchive={() => {}} onCopy={() => {}} />, {
        wrapper: MemoryRouter,
    });

    const actionsButton = screen.getByRole("button", {
        name: "Published dashboard actions",
    });
    fireEvent.click(actionsButton);

    const copyButton = screen.getByText("Copy");
    expect(copyButton).toBeInTheDocument();
});

test("renders a dashboard table", async () => {
    const { getByRole } = render(
        <PublishedTab dashboards={dashboards} onArchive={() => {}} onCopy={() => {}} />,
        {
            wrapper: MemoryRouter,
        },
    );

    const dashboard1 = getByRole("link", { name: "Dashboard One" });
    expect(dashboard1).toBeInTheDocument();

    const dashboard2 = getByRole("link", { name: "Dashboard Two" });
    expect(dashboard2).toBeInTheDocument();
});

test("filters dashboards based on search input", async () => {
    const { getByLabelText, getByRole } = render(
        <PublishedTab dashboards={dashboards} onArchive={() => {}} onCopy={() => {}} />,
        {
            wrapper: MemoryRouter,
        },
    );

    const dashboard1 = getByRole("link", { name: "Dashboard One" });
    const dashboard2 = getByRole("link", { name: "Dashboard Two" });

    // Make sure both dashboards show up in the table
    expect(dashboard1).toBeInTheDocument();
    expect(dashboard2).toBeInTheDocument();

    // Use search input to filter
    const search = getByLabelText("Search published dashboards");
    await act(async () => {
        fireEvent.input(search, {
            target: {
                value: "Dashboard two",
            },
        });
    });

    const searchButton = getByRole("button", { name: "Search" });
    await act(async () => {
        fireEvent.click(searchButton);
    });

    // Dashboard one should dissapear
    expect(dashboard1).not.toBeInTheDocument();
    expect(dashboard2).toBeInTheDocument();
});
