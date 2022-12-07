/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import FriendlyURLInput from "../FriendlyURLInput";

beforeEach(() => {
    render(
        <FriendlyURLInput
            id="friendlyURL"
            name="friendlyURL"
            label="FriendlyURL"
            baseUrl="https://www.example.com"
            required
        />,
    );
});

test("renders the preview of the URL", async () => {
    expect(screen.getByText("FriendlyURL")).toBeInTheDocument();
});
