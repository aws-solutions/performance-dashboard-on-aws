/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import VisualizeChart from "../VisualizeChart";
import { MemoryRouter } from "react-router-dom";
import { ChartType, DatasetType } from "../../models";
import Button from "../Button";

test("renders the VisualizeChart component", async () => {
  const wrapper = render(
    <VisualizeChart
      errors={[]}
      register={() => {}}
      json={[
        {
          id: "1",
          name: "Banana",
          updatedAt: "2021-11-11",
        },
        {
          id: "2",
          name: "Chocolate",
          updatedAt: "2020-11-11",
        },
        {
          id: "3",
          name: "Vanilla",
          updatedAt: "2019-11-11",
        },
      ]}
      csvJson={[]}
      datasetLoading={false}
      datasetType={DatasetType.DynamicDataset}
      onCancel={() => {}}
      backStep={() => {}}
      advanceStep={() => {}}
      fileLoading={false}
      processingWidget={false}
      fullPreview={false}
      fullPreviewButton={<Button>Full preview</Button>}
      submitButtonLabel="Add chart"
      summaryBelow={false}
      setSortByColumn={() => {}}
      setSortByDesc={() => {}}
      horizontalScroll={true}
      significantDigitLabels={false}
      originalJson={[
        {
          id: "1",
          name: "Banana",
          updatedAt: "2021-11-11",
        },
        {
          id: "2",
          name: "Chocolate",
          updatedAt: "2020-11-11",
        },
        {
          id: "3",
          name: "Vanilla",
          updatedAt: "2019-11-11",
        },
      ]}
      chartType={ChartType.LineChart}
      headers={["1", "2", "3"]}
      showTitle={true}
      summary={"summary"}
      title={"title"}
      columnsMetadata={[]}
      configHeader={<></>}
      dataLabels={false}
      showTotal={true}
      widgetId="widget-id"
      previewPanelId="panel-id"
      computePercentages={false}
      stackedChart={false}
    />,
    { wrapper: MemoryRouter }
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("renders the VisualizeChart component without horizontal scrolling", async () => {
  const wrapper = render(
    <VisualizeChart
      errors={[]}
      register={() => {}}
      json={[
        {
          id: "1",
          name: "Banana",
          updatedAt: "2021-11-11",
        },
        {
          id: "2",
          name: "Chocolate",
          updatedAt: "2020-11-11",
        },
        {
          id: "3",
          name: "Vanilla",
          updatedAt: "2019-11-11",
        },
      ]}
      csvJson={[]}
      datasetLoading={false}
      datasetType={DatasetType.DynamicDataset}
      onCancel={() => {}}
      backStep={() => {}}
      advanceStep={() => {}}
      fileLoading={false}
      processingWidget={false}
      fullPreview={false}
      fullPreviewButton={<Button>Full preview</Button>}
      submitButtonLabel="Add Chart"
      summaryBelow={false}
      setSortByColumn={() => {}}
      setSortByDesc={() => {}}
      horizontalScroll={false}
      significantDigitLabels={false}
      chartType={ChartType.LineChart}
      headers={["1", "2", "3"]}
      showTitle={true}
      summary={"summary"}
      title={"title"}
      originalJson={[
        {
          id: "1",
          name: "Banana",
          updatedAt: "2021-11-11",
        },
        {
          id: "2",
          name: "Chocolate",
          updatedAt: "2020-11-11",
        },
        {
          id: "3",
          name: "Vanilla",
          updatedAt: "2019-11-11",
        },
      ]}
      columnsMetadata={[]}
      configHeader={<></>}
      dataLabels={false}
      showTotal={true}
      widgetId="widget-id"
      previewPanelId="panel-id"
      computePercentages={false}
      stackedChart={false}
    />,
    { wrapper: MemoryRouter }
  );
  expect(wrapper.container).toMatchSnapshot();
});
