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

test("renders the title and summary of the image preview component", async () => {
  const { getByText } = render(
    <ImagePreview
      title="test title"
      summary="test summary"
      file={imageFile}
      summaryBelow={false}
    />,
    { wrapper: MemoryRouter }
  );
  expect(getByText("test title")).toBeInTheDocument();
  expect(getByText("test summary")).toBeInTheDocument();
  expect(getByText("test summary").nextSibling).toContainHTML("img");
});

test("renders the image preview component with the summary below the chart", async () => {
  const { getByText } = render(
    <ImagePreview
      title="test title"
      summary="test summary"
      file={imageFile}
      summaryBelow={true}
    />,
    { wrapper: MemoryRouter }
  );
  expect(getByText("test title")).toBeInTheDocument();
  expect(getByText("test summary")).toBeInTheDocument();
  expect(getByText("test summary").previousSibling).toContainHTML("img");
});

test("image preview should match snapshot", async () => {
  const wrapper = render(
    <ImagePreview
      title="test title"
      summary="test summary"
      file={imageFile}
      summaryBelow={false}
    />,
    { wrapper: MemoryRouter }
  );
  expect(wrapper.container).toMatchSnapshot();
});
