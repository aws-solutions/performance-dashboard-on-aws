/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardListing from "../DashboardListing";
import { MockedObserver, traceMethodCalls, IntersectionObserverCB } from "../../testUtils";

jest.mock("../../hooks");

describe("Tabs tests", () => {
    let observer: any;
    let mockedObserverCalls: { [k: string]: any } = {};
    beforeEach(() => {
        Object.defineProperty(window, "IntersectionObserver", {
            writable: true,
            value: jest.fn().mockImplementation(function TrackMock(
                cb: IntersectionObserverCB,
                // eslint-disable-next-line no-undef
                options: IntersectionObserverInit,
            ) {
                observer = traceMethodCalls(new MockedObserver(cb, options), mockedObserverCalls);

                return observer;
            }),
        });
    });
    afterEach(() => {
        observer = null;
        mockedObserverCalls = {};
    });
    test("renders a textfield Dashboards", async () => {
        const { getByText } = render(<DashboardListing />, {
            wrapper: MemoryRouter,
        });
        expect(getByText("Dashboards")).toBeInTheDocument();
    });

    test("renders the tabs", async () => {
        const { getByText } = render(<DashboardListing />, {
            wrapper: MemoryRouter,
        });
        expect(getByText("Drafts (1)")).toBeInTheDocument();
        expect(getByText("Published (1)")).toBeInTheDocument();
    });

    test("renders a dropdown menu", async () => {
        const { getByText } = render(<DashboardListing />, {
            wrapper: MemoryRouter,
        });
        expect(getByText("Actions")).toBeInTheDocument();
    });

    test("renders a button to create dashboard", async () => {
        const { getByRole } = render(<DashboardListing />, {
            wrapper: MemoryRouter,
        });
        const button = getByRole("button", { name: "Create dashboard" });
        expect(button).toBeInTheDocument();
    });

    test("renders a dashboard table", async () => {
        const { getByRole } = render(<DashboardListing />, {
            wrapper: MemoryRouter,
        });

        const dashboard1 = getByRole("link", { name: "Dashboard One" });
        expect(dashboard1).toBeInTheDocument();
    });

    test("filters dashboards based on name search input", async () => {
        const { getByLabelText, getByRole } = render(<DashboardListing />, {
            wrapper: MemoryRouter,
        });

        let dashboard1 = getByRole("link", { name: "Dashboard One" });

        // Make sure the dashboard show up in the table
        expect(dashboard1).toBeInTheDocument();

        // Use search input to filter
        const search = getByLabelText("Search draft dashboards");
        await act(async () => {
            fireEvent.input(search, {
                target: {
                    value: "Dashboard Two",
                },
            });
        });

        const searchButton2 = getByRole("button", { name: "Search" });
        await act(async () => {
            fireEvent.click(searchButton2);
        });

        // Dashboard one should dissapear
        expect(dashboard1).not.toBeInTheDocument();

        await act(async () => {
            fireEvent.input(search, {
                target: {
                    value: "Dashboard One",
                },
            });
        });

        const searchButton = getByRole("button", { name: "Search" });
        await act(async () => {
            fireEvent.click(searchButton);
        });

        dashboard1 = getByRole("link", { name: "Dashboard One" });

        // Dashboard one should appear
        expect(dashboard1).toBeInTheDocument();
    });

    test("filters dashboards based on createdBy search input", async () => {
        const { getByLabelText, getByRole, getByText } = render(<DashboardListing />, {
            wrapper: MemoryRouter,
        });

        let dashboard1 = getByText("test user");

        // Make sure the dashboard show up in the table
        expect(dashboard1).toBeInTheDocument();

        // Use search input to filter
        const search = getByLabelText("Search draft dashboards");
        await act(async () => {
            fireEvent.input(search, {
                target: {
                    value: "another test user",
                },
            });
        });

        const searchButton3 = getByRole("button", { name: "Search" });
        await act(async () => {
            fireEvent.click(searchButton3);
        });

        // Dashboard one should dissapear
        expect(dashboard1).not.toBeInTheDocument();

        await act(async () => {
            fireEvent.change(search, {
                target: {
                    value: "test user",
                },
            });
        });

        const searchButton = getByRole("button", { name: "Search" });
        await act(async () => {
            fireEvent.click(searchButton);
        });

        dashboard1 = getByText("test user");

        // Dashboard one should appear
        expect(dashboard1).toBeInTheDocument();
    });

    test("renders an archived tab", async () => {
        const { getByText } = render(<DashboardListing />, {
            wrapper: MemoryRouter,
        });

        expect(getByText("Archived (0)")).toBeInTheDocument();
    });
});
