/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import MarkdownSyntax from "../MarkdownSyntax";
import { MemoryRouter } from "react-router-dom";

test("renders the markdown syntax component", async () => {
  const wrapper = render(<MarkdownSyntax />);
  expect(wrapper.container).toMatchSnapshot();
});

test("renders the title of the markdown syntax component", async () => {
  const { findByText } = render(<MarkdownSyntax />, { wrapper: MemoryRouter });
  const title = await findByText("Markdown Syntax");
  expect(title).toBeInTheDocument();
});

test("renders the description of the markdown syntax component", async () => {
  const { findByText } = render(<MarkdownSyntax />, { wrapper: MemoryRouter });
  const title = await findByText(
    "Supported Markdown is limited to bold, hyperlinks and " +
      "single-level unordered lists. All other text and markdown " +
      "will be rendered as plain text."
  );
  expect(title).toBeInTheDocument();
});

test("renders the Bold of the markdown syntax component", async () => {
  const { findByText } = render(<MarkdownSyntax />, { wrapper: MemoryRouter });
  const title = await findByText("Bold");
  expect(title).toBeInTheDocument();
});

test("renders the Bold description of the markdown syntax component", async () => {
  const { findByText } = render(<MarkdownSyntax />, { wrapper: MemoryRouter });
  const title = await findByText(
    "To bold text, add two asterisks or underscores before and after a word " +
      "or phrase. To bold the middle of a word for emphasis, add two asterisks " +
      "without spaces around the letters."
  );
  expect(title).toBeInTheDocument();
});

test("renders the Hyperlink title of the markdown syntax component", async () => {
  const { findByText } = render(<MarkdownSyntax />, { wrapper: MemoryRouter });
  const title = await findByText("Hyperlink");
  expect(title).toBeInTheDocument();
});

test("renders the Hyperlink description of the markdown syntax component", async () => {
  const { findByText } = render(<MarkdownSyntax />, { wrapper: MemoryRouter });
  const title = await findByText(
    "To create a link, enclose the link text in brackets (e.g., [AWS]) and " +
      "then follow it immediately with the URL in parentheses (e.g., " +
      "(https://aws.amazon.com))."
  );
  expect(title).toBeInTheDocument();
});

test("renders the Unordered list title of the markdown syntax component", async () => {
  const { findByText } = render(<MarkdownSyntax />, { wrapper: MemoryRouter });
  const title = await findByText("Unordered list");
  expect(title).toBeInTheDocument();
});

test("renders the Unordered list description of the markdown syntax component", async () => {
  const { findByText } = render(<MarkdownSyntax />, { wrapper: MemoryRouter });
  const title = await findByText(
    "To create an unordered list, add dashes (-), asterisks (*), or plus " +
      "signs (+) and space in front of line items."
  );
  expect(title).toBeInTheDocument();
});
