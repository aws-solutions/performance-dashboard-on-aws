import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PublishedSiteSettings from "../PublishedSiteSettings";

jest.mock("../../hooks");

test("renders the title", async () => {
  const { getByRole } = render(<PublishedSiteSettings />, {
    wrapper: MemoryRouter,
  });
  expect(getByRole("heading", { name: "Published site" })).toBeInTheDocument();
});

test("renders the homepage title", async () => {
  const { getByRole } = render(<PublishedSiteSettings />, {
    wrapper: MemoryRouter,
  });
  expect(
    getByRole("heading", { name: "Homepage content" })
  ).toBeInTheDocument();
});

test("renders the homepage description", async () => {
  const { getByText } = render(<PublishedSiteSettings />, {
    wrapper: MemoryRouter,
  });
  expect(
    getByText(
      "This components appear on the homepage of your published site and " +
        "explain what your published site is about."
    )
  ).toBeInTheDocument();
});

test("renders the headline header", async () => {
  const { getByText } = render(<PublishedSiteSettings />, {
    wrapper: MemoryRouter,
  });
  expect(getByText("Headline")).toBeInTheDocument();
});

test("renders the headline statement", async () => {
  const { getByText } = render(<PublishedSiteSettings />, {
    wrapper: MemoryRouter,
  });
  expect(getByText("Kingdom of Wakanda")).toBeInTheDocument();
});

test("renders a button to edit", async () => {
  const { getByRole } = render(<PublishedSiteSettings />, {
    wrapper: MemoryRouter,
  });
  const button = getByRole("button", { name: "Edit" });
  expect(button).toBeInTheDocument();
});
