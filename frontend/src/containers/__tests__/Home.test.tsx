/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../Home";

jest.mock("../../hooks");

test("renders homepage title", async () => {
    const { getByRole } = render(<Home />, {
        wrapper: MemoryRouter,
    });
    expect(getByRole("heading", { name: "Kingdom of Wakanda" })).toBeInTheDocument();
});

test("renders homepage description", async () => {
    const { getByText } = render(<Home />, { wrapper: MemoryRouter });
    expect(getByText("Welcome to our dashboard")).toBeInTheDocument();
});

test("renders dashboards list", async () => {
    const { getByText } = render(<Home />, { wrapper: MemoryRouter });
    expect(getByText("Topic Area Bananas (1)")).toBeInTheDocument();
    expect(getByText("Dashboard One")).toBeInTheDocument();
    expect(getByText("Topic Area Grapes (1)")).toBeInTheDocument();
    expect(getByText("Dashboard Two")).toBeInTheDocument();
});
