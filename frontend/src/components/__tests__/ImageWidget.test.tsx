import React from "react";
import { render } from "@testing-library/react";
import { WidgetType, ImageWidget } from "../../models";
import ImageWidgetComponent from "../ImageWidget";

jest.mock("../../hooks");
window.URL.createObjectURL = jest.fn();

const image: ImageWidget = {
  id: "123",
  name: "Test Image",
  dashboardId: "abc",
  updatedAt: new Date(),
  widgetType: WidgetType.Image,
  order: 0,
  showTitle: true,
  content: {
    title: "Test Image",
    imageAltText: "Test Alt Text",
    summary: "test summary",
    summaryBelow: false,
    s3Key: {
      raw: "123.csv",
    },
    filename: "123.csv",
  },
};

test("renders an image with title", async () => {
  const { getByText } = render(<ImageWidgetComponent widget={image} />);
  expect(getByText("Test Image")).toBeInTheDocument();
});
