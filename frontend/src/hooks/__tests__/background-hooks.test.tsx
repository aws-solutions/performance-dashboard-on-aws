/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, cleanup } from "@testing-library/react";
import { useChangeBackgroundColor } from "../background-hooks";

describe("useChangeBackgroundColor", () => {
    const FooComponent = () => {
        useChangeBackgroundColor();
        return <></>;
    };
    test("should change background color", () => {
        const originalBackroundColor = document.body.style.background;
        render(<FooComponent />);
        const changedColor = "rgb(250, 250, 250)"; //"#fafafa"
        expect(document.body.style.background).toBe(changedColor);
        cleanup();
        expect(document.body.style.background).toBe(originalBackroundColor);
    });
});
