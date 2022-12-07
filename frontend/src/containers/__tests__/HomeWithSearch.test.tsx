/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomeWithSearch from "../HomeWithSearch";

jest.mock("../../hooks");

test("Renders homepage title", async () => {
    const { getByText } = render(<HomeWithSearch />, { wrapper: MemoryRouter });
    expect(getByText("Search results")).toBeInTheDocument();
});

test("Renders dashboards list", async () => {
    const { getByText } = render(<HomeWithSearch />, { wrapper: MemoryRouter });
    expect(getByText("Topic Area Bananas")).toBeInTheDocument();
    expect(getByText("Dashboard One")).toBeInTheDocument();
});
