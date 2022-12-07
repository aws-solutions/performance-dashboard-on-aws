/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import ColorsHelpPage from "../ColorsHelpPage";
import { MemoryRouter } from "react-router-dom";

test("renders the Colors Help Page component", async () => {
    const wrapper = render(<ColorsHelpPage />, { wrapper: MemoryRouter });
    expect(wrapper.container).toMatchSnapshot();
});
