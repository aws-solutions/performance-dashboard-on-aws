/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FourZeroFour from "../FourZeroFour";

test("renders a FourZeroFour component", async () => {
    const wrapper = render(<FourZeroFour />, { wrapper: MemoryRouter });
    expect(wrapper.container).toMatchSnapshot();
});
