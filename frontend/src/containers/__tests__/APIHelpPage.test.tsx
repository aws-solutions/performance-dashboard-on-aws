/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import APIHelpPage from "../APIHelpPage";
import { MemoryRouter } from "react-router-dom";

test("renders the API Help Page component", async () => {
    const wrapper = render(<APIHelpPage />, { wrapper: MemoryRouter });
    expect(wrapper.container).toMatchSnapshot();
});
