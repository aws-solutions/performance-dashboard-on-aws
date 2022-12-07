/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Breadcrumbs from "../Breadcrumbs";

test("renders a breadcrumb with no crumbs", async () => {
    const wrapper = render(<Breadcrumbs crumbs={[]} />, {
        wrapper: MemoryRouter,
    });
    expect(wrapper.container).toMatchSnapshot();
});

test("renders a breadcrumb with one crumb", async () => {
    const wrapper = render(
        <Breadcrumbs
            crumbs={[
                {
                    label: "Add content",
                },
            ]}
        />,
        { wrapper: MemoryRouter },
    );
    expect(wrapper.container).toMatchSnapshot();
});

test("renders a breadcrumb with two crumbs", async () => {
    const wrapper = render(
        <Breadcrumbs
            crumbs={[
                {
                    label: "Home",
                    url: "/home",
                },
                {
                    label: "Add content",
                },
            ]}
        />,
        { wrapper: MemoryRouter },
    );
    expect(wrapper.container).toMatchSnapshot();
});
