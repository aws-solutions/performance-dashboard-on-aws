/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "../Footer";

describe("FooterLayout", () => {
    test("renders the component", async () => {
        const wrapper = render(<Footer />, { wrapper: MemoryRouter });
        expect(wrapper.container).toMatchSnapshot();
    });
});
