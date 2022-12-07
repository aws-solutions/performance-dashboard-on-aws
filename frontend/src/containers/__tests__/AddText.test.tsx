/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BackendService from "../../services/BackendService";
import AddText from "../AddText";

jest.mock("../../services/BackendService");

beforeEach(() => {
    BackendService.createWidget = jest.fn();
});

test("renders title and subtitles", async () => {
    const { getByText, getByRole } = render(<AddText />, {
        wrapper: MemoryRouter,
    });
    expect(getByRole("heading", { name: "Add text" })).toBeInTheDocument();
    expect(getByText("Configure text content")).toBeInTheDocument();
});

test("renders a text input for title", async () => {
    const { getByLabelText } = render(<AddText />, { wrapper: MemoryRouter });
    expect(getByLabelText("Text title*")).toBeInTheDocument();
});

test("renders a text input for content", async () => {
    const { getByLabelText } = render(<AddText />, { wrapper: MemoryRouter });
    expect(getByLabelText("Text*")).toBeInTheDocument();
});

test("on submit, it calls createWidget api", async () => {
    const { getByRole, getByLabelText } = render(<AddText />, {
        wrapper: MemoryRouter,
    });

    fireEvent.input(getByLabelText("Text title*"), {
        target: {
            value: "Content title goes here",
        },
    });

    fireEvent.change(getByLabelText("Text*"), {
        target: {
            value: "Text content here",
        },
    });

    await act(async () => {
        fireEvent.click(getByRole("button", { name: "Add text" }));
    });

    expect(BackendService.createWidget).toHaveBeenCalled();
});

test("renders the expand preview button", async () => {
    const { getByRole } = render(<AddText />, { wrapper: MemoryRouter });
    expect(getByRole("button", { name: "Expand preview" })).toBeInTheDocument();
});
