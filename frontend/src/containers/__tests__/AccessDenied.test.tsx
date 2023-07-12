/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AccessDenied from "../AccessDenied";

beforeEach(() => {
    render(<AccessDenied />, { wrapper: MemoryRouter });
});

test("renders a welcome message", async () => {
    expect(screen.getByText("Welcome to the Performance Dashboard")).toBeInTheDocument();
});

test("renders a request access button", async () => {
    expect(screen.getByRole("button", { name: "Request access" })).toBeInTheDocument();
});
