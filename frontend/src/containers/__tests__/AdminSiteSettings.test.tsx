/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminSiteSettings from "../AdminSiteSettings";

jest.mock("../../hooks");

test("renders the title", async () => {
  const { getByRole } = render(<AdminSiteSettings />, {
    wrapper: MemoryRouter,
  });
  expect(getByRole("heading", { name: "Admin site" })).toBeInTheDocument();
});

test("renders the description", async () => {
  const { getByText } = render(<AdminSiteSettings />, {
    wrapper: MemoryRouter,
  });
  expect(
    getByText("Customize settings for the internal site.")
  ).toBeInTheDocument();
});

test("renders the acknowledgement statement header", async () => {
  const { getByText } = render(<AdminSiteSettings />, {
    wrapper: MemoryRouter,
  });
  expect(getByText("Support contact email address")).toBeInTheDocument();
});

test("renders the acknowledgement statement", async () => {
  const { getByText } = render(<AdminSiteSettings />, {
    wrapper: MemoryRouter,
  });
  expect(getByText("admin1@aol.com")).toBeInTheDocument();
});

test("renders a button to edit", async () => {
  const { getByRole } = render(<AdminSiteSettings />, {
    wrapper: MemoryRouter,
  });
  const button = getByRole("button", { name: "Edit" });
  expect(button).toBeInTheDocument();
});

test("publishing guidance settings should match snapshot", async () => {
  const wrapper = render(<AdminSiteSettings />, {
    wrapper: MemoryRouter,
  });
  expect(wrapper.container).toMatchSnapshot();
});
