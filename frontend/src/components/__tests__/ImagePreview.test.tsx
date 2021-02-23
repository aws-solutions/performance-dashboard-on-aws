import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ImagePreview from "../ImagePreview";

const imageFile = {
  type: "image/png",
  name: "myphoto.png",
  size: 100,
} as File;

window.URL.createObjectURL = jest.fn();

test("renders the image title", async () => {
  render(
    <ImagePreview
      title="test title"
      summary="test summary"
      file={imageFile}
      summaryBelow={false}
      altText="alt text"
    />,
    { wrapper: MemoryRouter }
  );
  expect(screen.getByText("test title")).toBeInTheDocument();
});

test("renders the summary below the image", async () => {
  render(
    <ImagePreview
      title="test title"
      summary="test summary"
      file={imageFile}
      summaryBelow={true}
      altText="alt text"
    />,
    { wrapper: MemoryRouter }
  );

  const summary = screen.getByText("test summary");
  expect(summary).toBeInTheDocument();
  expect(summary.closest("div")).toHaveClass("imageSummaryBelow");
});

test("renders the summary above the image", async () => {
  render(
    <ImagePreview
      title="test title"
      summary="test summary"
      file={imageFile}
      summaryBelow={false}
      altText="alt text"
    />,
    { wrapper: MemoryRouter }
  );

  const summary = screen.getByText("test summary");
  expect(summary).toBeInTheDocument();
  expect(summary.closest("div")).toHaveClass("imageSummaryAbove");
});

test("image preview should match snapshot", async () => {
  const wrapper = render(
    <ImagePreview
      title="test title"
      summary="test summary"
      file={imageFile}
      summaryBelow={false}
      altText="alt text"
    />,
    { wrapper: MemoryRouter }
  );
  expect(wrapper.container).toMatchSnapshot();
});
