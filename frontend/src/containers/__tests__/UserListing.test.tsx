/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { fireEvent, render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserListing from "../UserListing";
import BackendService from "../../services/BackendService";
import userEvent from "@testing-library/user-event";

jest.mock("../../hooks");
jest.mock("../../services/BackendService");

test("renders page title", () => {
  render(<UserListing />, {
    wrapper: MemoryRouter,
  });
  expect(
    screen.getByRole("heading", { name: "Manage users" })
  ).toBeInTheDocument();
});

test("renders search box", () => {
  render(<UserListing />, {
    wrapper: MemoryRouter,
  });
  expect(screen.getByRole("searchbox", { name: "Search" })).toBeInTheDocument();
});

test("renders an Add user button", () => {
  render(<UserListing />, {
    wrapper: MemoryRouter,
  });
  expect(
    screen.getByRole("button", { name: "Add user(s)" })
  ).toBeInTheDocument();
});

test("renders a table with users", () => {
  render(<UserListing />, {
    wrapper: MemoryRouter,
  });
  expect(screen.getByRole("table")).toBeInTheDocument();
  expect(screen.getByText("johndoe@example.com")).toBeInTheDocument();
});

test("renders the dropdown menu", () => {
  render(<UserListing />, {
    wrapper: MemoryRouter,
  });
  expect(screen.getByText("Actions")).toBeInTheDocument();
});

test("dropdown menu expands when clicked", () => {
  render(<UserListing />, {
    wrapper: MemoryRouter,
  });
  userEvent.click(screen.getByText("Actions"));
  expect(screen.getByText("Resend invite email")).toBeInTheDocument();
  expect(screen.getByText("Remove users")).toBeInTheDocument();
});

test("dropdown menu options are disabled when approptiate", () => {
  render(<UserListing />, {
    wrapper: MemoryRouter,
  });
  userEvent.click(screen.getByText("Actions"));
  expect(screen.getByText("Resend invite email")).toHaveAttribute(
    "aria-disabled",
    "true"
  );
  expect(screen.getByText("Remove users")).toHaveAttribute(
    "aria-disabled",
    "true"
  );
});

test("remove user button deletes selected users", async () => {
  render(<UserListing />, {
    wrapper: MemoryRouter,
  });
  // First select user from the table
  const checkbox = screen.getByRole("checkbox", { name: "johndoe" });
  fireEvent.click(checkbox);

  // Click remove users button
  userEvent.click(screen.getByText("Actions"));
  userEvent.click(screen.getByText("Remove users"));

  // Wait for confirmation modal to show
  await screen.findByText("Are you sure you want to remove 1 user?");
  const deleteButton = screen.getByRole("button", { name: "Delete" });
  await act(async () => {
    fireEvent.click(deleteButton);
  });

  //  Verify backend service gets called
  expect(BackendService.removeUsers).toBeCalledWith(["johndoe"]);
});
