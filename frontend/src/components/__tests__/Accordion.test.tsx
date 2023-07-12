/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import Accordion from "../Accordion";

test("renders an accordion with multiple elements", async () => {
    const wrapper = render(
        <Accordion>
            <Accordion.Item id="1" key="1" title="Element 1">
                <p>Hello this is an item in the accordion.</p>
            </Accordion.Item>
            <Accordion.Item id="2" key="2" title="Element 2">
                <p>Hello this is a second item in the accordion.</p>
            </Accordion.Item>
            <Accordion.Item id="3" key="3" title="Element 3">
                <p>Hello this is a third item in the accordion.</p>
            </Accordion.Item>
        </Accordion>,
    );
    expect(wrapper.container).toMatchSnapshot();
});
