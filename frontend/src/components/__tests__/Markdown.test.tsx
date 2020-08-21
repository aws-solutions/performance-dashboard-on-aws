import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Markdown from "../Markdown";

test("renders the text of the markdown component", async () => {
  const { getByRole } = render(
    <Markdown
      id="description"
      name="description"
      defaultValue="text test"
      label="Test"
      hint="Subtitle test."
    />,
    { wrapper: MemoryRouter }
  );
  expect(getByRole("textbox")).toHaveValue("text test");
});

test("renders the title of the markdown component", async () => {
  const { findByText } = render(
    <Markdown
      id="description"
      name="description"
      label="Test"
      hint="Subtitle test."
    />,
    { wrapper: MemoryRouter }
  );
  const title = await findByText("Test");
  expect(title).toBeInTheDocument();
});

test("renders the subtitle of the markdown component", async () => {
  const { findByText } = render(
    <Markdown
      id="description"
      name="description"
      label="Test"
      hint="Subtitle test."
    />,
    { wrapper: MemoryRouter }
  );
  const hint = await findByText(
    "Subtitle test. This text area supports limited Markdown."
  );
  expect(hint).toBeInTheDocument();
});

test("renders the placeholder of the markdown component", async () => {
  const { findByPlaceholderText } = render(
    <Markdown
      id="description"
      name="description"
      label="Test"
      hint="Subtitle test."
    />,
    { wrapper: MemoryRouter }
  );
  const subtitle = await findByPlaceholderText("Enter text here");
  expect(subtitle).toBeInTheDocument();
});
