import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Markdown from "../Markdown";

test("renders the text of the markdown component", async () => {
  const { findByText } = render(
    <Markdown
      text="text test"
      title="Test"
      subtitle="Subtitle test."
      onChange={() => {}}
    />,
    { wrapper: MemoryRouter }
  );
  const title = await findByText("text test");
  expect(title).toBeInTheDocument();
});

test("renders the title of the markdown component", async () => {
  const { findByText } = render(
    <Markdown
      text=""
      title="Test"
      subtitle="Subtitle test."
      onChange={() => {}}
    />,
    { wrapper: MemoryRouter }
  );
  const title = await findByText("Test");
  expect(title).toBeInTheDocument();
});

test("renders the subtitle of the markdown component", async () => {
  const { findByText } = render(
    <Markdown
      text=""
      title="Test"
      subtitle="Subtitle test."
      onChange={() => {}}
    />,
    { wrapper: MemoryRouter }
  );
  const subtitle = await findByText(
    "Subtitle test. This text area supports limited Markdown."
  );
  expect(subtitle).toBeInTheDocument();
});

test("renders the placeholder of the markdown component", async () => {
  const { findByPlaceholderText } = render(
    <Markdown
      text=""
      title="Test"
      subtitle="Subtitle test."
      onChange={() => {}}
    />,
    { wrapper: MemoryRouter }
  );
  const subtitle = await findByPlaceholderText("Enter overview text here");
  expect(subtitle).toBeInTheDocument();
});
