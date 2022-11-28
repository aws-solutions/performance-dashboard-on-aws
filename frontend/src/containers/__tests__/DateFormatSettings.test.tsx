/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DateFormatSettings from "../DateFormatSettings";

jest.mock("../../hooks");
jest.mock("dayjs", () => () => {
  const dayjs = jest.requireActual("dayjs");
  return dayjs("2020-12-09 03:30:00");
});

beforeEach(() => {
  render(<DateFormatSettings />, {
    wrapper: MemoryRouter,
  });
});

test("renders a title", async () => {
  const title = screen.getByRole("heading", { name: "Date and time format" });
  expect(title).toBeInTheDocument();
});

test("renders the date format", async () => {
  const dateFormat = screen.getByText("2020-12-09 (YYYY-MM-DD)");
  expect(dateFormat).toBeInTheDocument();
});

test("renders the time format", async () => {
  const timeFormat = screen.getByText("03:30 (HH:mm)");
  expect(timeFormat).toBeInTheDocument();
});

test("date format settings should match snapshot", async () => {
  const wrapper = render(<DateFormatSettings />, {
    wrapper: MemoryRouter,
  });
  expect(wrapper.container).toMatchSnapshot();
});
