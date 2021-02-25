import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PublishingGuidanceSettings from "../PublishingGuidanceSettings";

jest.mock("../../hooks");

test("renders the title", async () => {
  const { getByRole } = render(<PublishingGuidanceSettings />, {
    wrapper: MemoryRouter,
  });
  expect(
    getByRole("heading", { name: "Publishing guidance" })
  ).toBeInTheDocument();
});

test("renders the description", async () => {
  const { getByText } = render(<PublishingGuidanceSettings />, {
    wrapper: MemoryRouter,
  });
  expect(
    getByText(
      "Publishing guidance is text that users must acknowledge before they " +
        "publish a dashboard. For example, use this text to remind them to check " +
        "for errors or mistakes, sensitive or confidential data, or guidance " +
        "specific to your organization."
    )
  ).toBeInTheDocument();
});

test("renders the acknowledgement statement header", async () => {
  const { getByText } = render(<PublishingGuidanceSettings />, {
    wrapper: MemoryRouter,
  });
  expect(getByText("Acknowledgement statement")).toBeInTheDocument();
});

test("renders the acknowledgement statement", async () => {
  const { getByText } = render(<PublishingGuidanceSettings />, {
    wrapper: MemoryRouter,
  });
  expect(
    getByText(
      "I acknowledge that I have reviewed the dashboard and it is ready to publish"
    )
  ).toBeInTheDocument();
});

test("renders a button to edit", async () => {
  const { getByRole } = render(<PublishingGuidanceSettings />, {
    wrapper: MemoryRouter,
  });
  const button = getByRole("button", { name: "Edit" });
  expect(button).toBeInTheDocument();
});

test("publishing guidance settings should match snapshot", async () => {
  const wrapper = render(<PublishingGuidanceSettings />, {
    wrapper: MemoryRouter,
  });
  expect(wrapper.container).toMatchSnapshot();
});
