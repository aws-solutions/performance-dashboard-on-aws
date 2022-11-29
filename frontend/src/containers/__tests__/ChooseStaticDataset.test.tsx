/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import dayjs from "dayjs";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ChooseStaticDataset from "../ChooseStaticDataset";

jest.mock("../../hooks");
jest.mock("../../services/BackendService");

beforeEach(() => {
  render(<ChooseStaticDataset />, {
    wrapper: MemoryRouter,
  });
});

test("renders page title", () => {
  expect(
    screen.getByRole("heading", { name: "Choose static dataset" })
  ).toBeInTheDocument();
});

test("renders search box", () => {
  expect(screen.getByRole("searchbox", { name: "Search" })).toBeInTheDocument();
});

test("renders a select and continue button", () => {
  expect(
    screen.getByRole("button", { name: "Select and continue" })
  ).toBeInTheDocument();
});

test("renders a cancel button", () => {
  expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
});

test("renders a table with users", () => {
  expect(screen.getByRole("table")).toBeInTheDocument();
  expect(screen.getByText("andrew")).toBeInTheDocument();
  expect(screen.getByText("abc")).toBeInTheDocument();
  expect(
    screen.getByText(dayjs.utc("1/1/2000").format("YYYY-MM-DD HH:mm"))
  ).toBeInTheDocument();
});
