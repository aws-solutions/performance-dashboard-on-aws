/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, within } from "@testing-library/react";
import Tab from "../Tab";
import { MemoryRouter } from "react-router-dom";

test("renders the Tab component", async () => {
  const wrapper = render(
    <Tab
      id="tab1"
      activeTab="tab1"
      key="Tab 1"
      label="Tab 1"
      onClick={() => {}}
    />
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("renders the Tab component with default tab 2 selected", async () => {
  const wrapper = render(
    <Tab
      id="tab1"
      activeTab="tab2"
      key="Tab 1"
      label="Tab 1"
      onClick={() => {}}
    />
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("renders the tab", async () => {
  const { getAllByRole } = render(
    <Tab
      id="tab1"
      activeTab="tab2"
      key="Tab 1"
      label="Tab 1"
      onClick={() => {}}
    />,
    {
      wrapper: MemoryRouter,
    }
  );

  const listItems = getAllByRole("tab");
  expect(listItems).toHaveLength(1);

  listItems.forEach((item, index) => {
    const { getByText } = within(item);
    expect(getByText(`Tab ${index + 1}`)).toBeInTheDocument();
  });
});
