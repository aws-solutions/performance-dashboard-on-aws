/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import StepIndicator from "../StepIndicator";

test("renders a step indicator with multiple segments", async () => {
  const wrapper = render(
    <StepIndicator
      current={0}
      segments={[
        {
          label: "Step 1",
        },
        {
          label: "Step 2",
        },
        {
          label: "Step 3",
        },
      ]}
      showStepChart={true}
      showStepText={false}
    />
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a step indicator with one completed step", async () => {
  const wrapper = render(
    <StepIndicator
      current={1}
      segments={[
        {
          label: "Step 1",
        },
        {
          label: "Step 2",
        },
        {
          label: "Step 3",
        },
      ]}
      showStepChart={true}
      showStepText={false}
    />
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("returns null when current is out of bounds", async () => {
  const wrapper = render(
    <StepIndicator
      current={-1}
      segments={[
        {
          label: "Step 1",
        },
      ]}
      showStepChart={true}
      showStepText={false}
    />
  );
  expect(wrapper.container).toMatchSnapshot();
});
