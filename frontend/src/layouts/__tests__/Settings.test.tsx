/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SettingsLayout from "../Settings";

jest.mock("../../services/BackendService");
jest.mock("../../hooks");

describe("SettingsLayout", () => {
    test("renders the component", async () => {
        const wrapper = render(<SettingsLayout />, { wrapper: MemoryRouter });
        expect(wrapper.container).toMatchSnapshot();
    });
});
