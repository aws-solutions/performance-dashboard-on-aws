/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import FileInput from "../FileInput";

test("renders a file input element", async () => {
  const wrapper = render(
    <FileInput id="data" name="data" label="Select a file" />
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a file input with loading state", async () => {
  const wrapper = render(
    <FileInput id="data" name="data" label="Select a file" loading />
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a disabled file input", async () => {
  const wrapper = render(
    <FileInput id="data" name="data" label="Select a file" disabled />
  );
  expect(wrapper.container).toMatchSnapshot();
});
