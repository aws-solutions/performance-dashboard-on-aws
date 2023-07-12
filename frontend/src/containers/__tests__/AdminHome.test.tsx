/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, fireEvent, act, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import AdminHome from "../AdminHome";

const history = createMemoryHistory();

beforeEach(() => {
    jest.spyOn(history, "push");
    // eslint-disable-next-line no-undef
    global.open = jest.fn();
    render(
        <Router history={history}>
            <AdminHome />
        </Router>,
    );
});

test("renders a welcome title", async () => {
    expect(screen.getByText("Welcome to the Performance Dashboard")).toBeInTheDocument();
});

test("renders a create dashboard button", async () => {
    const createButton = screen.getByRole("button", {
        name: "Create dashboard",
    });
    expect(createButton).toBeInTheDocument();

    await act(async () => {
        fireEvent.click(createButton);
    });

    expect(history.push).toBeCalledWith("/admin/dashboard/create");
});

test("renders a view dashboard button", async () => {
    const viewButton = screen.getByRole("button", { name: "Manage users" });
    expect(viewButton).toBeInTheDocument();

    await act(async () => {
        fireEvent.click(viewButton);
    });

    expect(history.push).toBeCalledWith("/admin/users");
});

test("renders a view dashboard button", async () => {
    const viewButton = screen.getByRole("button", { name: "View settings" });
    expect(viewButton).toBeInTheDocument();

    await act(async () => {
        fireEvent.click(viewButton);
    });

    expect(history.push).toBeCalledWith("/admin/settings");
});

test("renders a view public site link", async () => {
    const viewLink = screen.getByRole("link", {
        name: "View the published site (opens in a new tab)",
    });

    expect(viewLink).toBeInTheDocument();
    expect(viewLink).toHaveAttribute("target", "_blank");
    expect(viewLink).toHaveAttribute("href", "/");
});
