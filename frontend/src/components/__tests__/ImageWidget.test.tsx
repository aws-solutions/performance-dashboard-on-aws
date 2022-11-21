/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ImageWidget from "../ImageWidget";

const imageFile = {
  type: "image/png",
  name: "myphoto.png",
  size: 100,
} as File;

window.URL.createObjectURL = jest.fn();

test("renders the image title", async () => {
  render(
    <ImageWidget
      title="test title"
      summary="test summary"
      file={imageFile}
      summaryBelow={false}
      altText="alt text"
      scalePct="75%"
    />,
    { wrapper: MemoryRouter }
  );
  expect(screen.getByText("test title")).toBeInTheDocument();
});

test("renders the summary below the image", async () => {
  render(
    <ImageWidget
      title="test title"
      summary="test summary"
      file={imageFile}
      summaryBelow={true}
      altText="alt text"
      scalePct="75%"
    />,
    { wrapper: MemoryRouter }
  );

  const summary = screen.getByText("test summary");
  expect(summary).toBeInTheDocument();
  expect(summary.closest("div")).toHaveClass("imageSummaryBelow");
});

test("renders the summary above the image", async () => {
  render(
    <ImageWidget
      title="test title"
      summary="test summary"
      file={imageFile}
      summaryBelow={false}
      altText="alt text"
      scalePct="75%"
    />,
    { wrapper: MemoryRouter }
  );

  const summary = screen.getByText("test summary");
  expect(summary).toBeInTheDocument();
  expect(summary.closest("div")).toHaveClass("imageSummaryAbove");
});

test("image preview should match snapshot", async () => {
  const wrapper = render(
    <ImageWidget
      title="test title"
      summary="test summary"
      file={imageFile}
      summaryBelow={false}
      altText="alt text"
      scalePct="75%"
    />,
    { wrapper: MemoryRouter }
  );
  expect(wrapper.container).toMatchSnapshot();
});
