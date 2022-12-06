/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { MemoryRouter, Router } from "react-router-dom";
import BackendService from "../../services/BackendService";
import AddSection from "../AddSection";
import { createMemoryHistory } from "history";

jest.mock("../../services/BackendService");

beforeEach(() => {
    BackendService.createWidget = jest.fn();
});

test("renders the component", async () => {
    const { getByText, getByRole, getByLabelText } = render(<AddSection />, {
        wrapper: MemoryRouter,
    });
    expect(getByRole("heading", { name: "Add section" })).toBeInTheDocument();
    expect(getByText("Configure section content")).toBeInTheDocument();
    expect(getByLabelText("Section title*")).toBeInTheDocument();
    expect(getByLabelText("Section summary (optional)")).toBeInTheDocument();
});

test("on submit, it calls createWidget api", async () => {
    const { getByRole, getByLabelText } = render(<AddSection />, {
        wrapper: MemoryRouter,
    });

    fireEvent.input(getByLabelText("Section title*"), {
        target: {
            value: "Content title goes here",
        },
    });

    await act(async () => {
        fireEvent.click(getByRole("button", { name: "Add section" }));
    });

    expect(BackendService.createWidget).toHaveBeenCalled();
});

test("cancel link takes you to Edit Dashboard screen", async () => {
    const history = createMemoryHistory();
    jest.spyOn(history, "push");

    const { findByRole } = render(
        <Router history={history}>
            <AddSection />
        </Router>,
    );

    await act(async () => {
        const cancelButton = await findByRole("button", { name: "Cancel" });
        fireEvent.click(cancelButton);
    });

    expect(history.push).toHaveBeenCalledWith("/admin/dashboard/edit/undefined");
});
