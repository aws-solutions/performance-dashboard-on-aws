import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserListing from "../UserListing";

jest.mock("../../hooks");

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
