/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { render } from "@testing-library/react";
import RenderLegendText from "../Legend";

test("renders the legend", async () => {
    const wrapper = render(RenderLegendText("Legend", { color: "red" }));
    expect(wrapper.container).toMatchSnapshot();
});
