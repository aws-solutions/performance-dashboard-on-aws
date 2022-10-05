import React from "react";
import { render } from "@testing-library/react";
import { Widget } from "../../models";
import TextWidget from "../TextWidget";
import { MemoryRouter } from "react-router-dom";

const widget: Widget = {
  id: "abc",
  name: "Benefits of Bananas",
  dashboardId: "123",
  order: 1,
  showTitle: true,
  updatedAt: new Date(),
  widgetType: "Text",
  content: { text: "This is simple plain text" },
};

test("renders widget name as title", async () => {
  const { getByRole } = render(
    <MemoryRouter>
      <TextWidget widget={widget} />
    </MemoryRouter>
  );
  expect(
    getByRole("heading", { name: "Benefits of Bananas" })
  ).toBeInTheDocument();
});

test("renders plain text", async () => {
  const { getByText } = render(
    <MemoryRouter>
      <TextWidget widget={widget} />
    </MemoryRouter>
  );
  expect(getByText("This is simple plain text")).toBeInTheDocument();
});

test("renders markdown text", async () => {
  widget.content.text = "This **text** has _markdown_";
  const { container } = render(
    <MemoryRouter>
      <TextWidget widget={widget} />
    </MemoryRouter>
  );
  expect(container).toMatchSnapshot();
});
