/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import DatePicker from "../DatePicker";

test("renders a date input element", async () => {
    const wrapper = render(
        <DatePicker
            id="date"
            name="date"
            label="Select a date"
            date={undefined}
            setDate={undefined}
            dateFormat={"YYYY-MM-DD"}
        />,
    );

    expect(wrapper.container).toMatchSnapshot();
});
