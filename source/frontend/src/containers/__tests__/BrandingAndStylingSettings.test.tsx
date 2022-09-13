import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BrandingAndStylingSettings from "../BrandingAndStylingSettings";

jest.mock("../../hooks");

test("renders the title", async () => {
  const { getByRole } = render(<BrandingAndStylingSettings />, {
    wrapper: MemoryRouter,
  });
  expect(
    getByRole("heading", { name: "Branding and styling" })
  ).toBeInTheDocument();
});

test("renders the description", async () => {
  const { getByText } = render(<BrandingAndStylingSettings />, {
    wrapper: MemoryRouter,
  });
  expect(
    getByText("Customize your performance dashboard.")
  ).toBeInTheDocument();
});

test("renders the logo title", async () => {
  const { getByRole } = render(<BrandingAndStylingSettings />, {
    wrapper: MemoryRouter,
  });
  expect(getByRole("heading", { name: "Logo" })).toBeInTheDocument();
});

test("renders the logo description", async () => {
  const { getByText } = render(<BrandingAndStylingSettings />, {
    wrapper: MemoryRouter,
  });
  expect(
    getByText(
      "This logo will appear in the header next to the performance dashboard name and in the published site header."
    )
  ).toBeInTheDocument();
});

test("renders the colors title", async () => {
  const { getByRole } = render(<BrandingAndStylingSettings />, {
    wrapper: MemoryRouter,
  });
  expect(getByRole("heading", { name: "Colors" })).toBeInTheDocument();
});

test("renders the colors description", async () => {
  const { getByText } = render(<BrandingAndStylingSettings />, {
    wrapper: MemoryRouter,
  });
  expect(
    getByText(
      "Customize these colors to make your dashboards appear similar in style to your organization's brand and color palette."
    )
  ).toBeInTheDocument();
});

test("renders two  buttons to edit", async () => {
  const { getAllByRole } = render(<BrandingAndStylingSettings />, {
    wrapper: MemoryRouter,
  });
  const buttons = getAllByRole("button", { name: "Edit" });
  expect(buttons[0]).toBeInTheDocument();
  expect(buttons[1]).toBeInTheDocument();
});

test("branding and styling settings should match snapshot", async () => {
  const wrapper = render(<BrandingAndStylingSettings />, {
    wrapper: MemoryRouter,
  });
  expect(wrapper.container).toMatchSnapshot();
});
