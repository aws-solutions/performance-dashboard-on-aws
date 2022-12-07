/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import ShareButton from "../ShareButton";
import { MemoryRouter } from "react-router-dom";

test("renders the anchor button", async () => {
    const { getByLabelText } = render(
        <MemoryRouter>
            <ShareButton id="1" title="test" />
        </MemoryRouter>,
    );
    const copyButton = getByLabelText("Copy link: test");

    expect(copyButton).toBeInTheDocument();
});
