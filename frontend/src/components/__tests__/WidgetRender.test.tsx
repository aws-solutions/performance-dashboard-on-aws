import React from "react";
import { render } from "@testing-library/react";
import WidgetRender from "../WidgetRender";
import { ChartWidget, ImageWidget, Widget, WidgetType } from "../../models";

test("renders a text widget", async () => {
  const textWidget = {
    widgetType: WidgetType.Text,
    content: { text: "Text widget" },
  } as Widget;
  const wrapper = render(<WidgetRender widget={textWidget} />);
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a chart widget", async () => {
  const chartWidget = {
    widgetType: WidgetType.Chart,
    content: { s3Key: { json: "data.json" } },
  } as ChartWidget;
  const wrapper = render(<WidgetRender widget={chartWidget} />);
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a table widget", async () => {
  const tableWidget = {
    widgetType: WidgetType.Table,
    content: { s3Key: { json: "data.json" } },
  } as Widget;
  const wrapper = render(<WidgetRender widget={tableWidget} />);
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a metrics widget", async () => {
  const metricsWidget = {
    widgetType: WidgetType.Metrics,
    content: { s3Key: { json: "data.json" } },
  } as Widget;
  const wrapper = render(<WidgetRender widget={metricsWidget} />);
  expect(wrapper.container).toMatchSnapshot();
});

test("renders an image widget", async () => {
  URL.createObjectURL = jest.fn();
  const textWidget = {
    widgetType: WidgetType.Image,
    content: { s3Key: { raw: "rawData" } },
  } as ImageWidget;
  const wrapper = render(<WidgetRender widget={textWidget} />);
  expect(URL.createObjectURL).toBeCalled();
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a section widget", async () => {
  const sectionWidget = {
    widgetType: WidgetType.Section,
    content: { s3Key: { json: "data.json" } },
  } as Widget;
  const wrapper = render(<WidgetRender widget={sectionWidget} />);
  expect(wrapper.container).toMatchSnapshot();
});
