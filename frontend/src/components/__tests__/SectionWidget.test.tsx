/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SectionWidget from "../SectionWidget";
import { Widget, WidgetType } from "../../models";

const widget: Widget = {
  id: "abc",
  name: "Benefits of Bananas",
  dashboardId: "123",
  order: 1,
  showTitle: true,
  updatedAt: new Date(),
  widgetType: WidgetType.Section,
  content: {
    showWithTabs: false,
    title: "test title",
    summary: "test summary",
  },
};

test("renders the section title and summary", async () => {
  render(
    <SectionWidget
      widget={widget}
      showMobilePreview={false}
      widgets={[widget]}
      setActiveWidgetId={() => {}}
    />,
    { wrapper: MemoryRouter }
  );

  expect(screen.getByText("test title")).toBeInTheDocument();
  const summary = screen.getByText("test summary");
  expect(summary).toBeInTheDocument();
});

test("section preview should match snapshot", async () => {
  const wrapper = render(
    <SectionWidget
      widget={widget}
      showMobilePreview={false}
      widgets={[widget]}
      setActiveWidgetId={() => {}}
    />,
    { wrapper: MemoryRouter }
  );
  expect(wrapper.container).toMatchSnapshot();
});
