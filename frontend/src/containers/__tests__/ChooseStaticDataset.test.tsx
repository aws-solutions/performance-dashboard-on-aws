import React from "react";
import { fireEvent, render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ChooseStaticDataset from "../ChooseStaticDataset";
import BackendService from "../../services/BackendService";
import userEvent from "@testing-library/user-event";

jest.mock("../../hooks");
jest.mock("../../services/BackendService");

test("renders page title", () => {
  render(<ChooseStaticDataset />, {
    wrapper: MemoryRouter,
  });
  expect(
    screen.getByRole("heading", { name: "Choose static dataset" })
  ).toBeInTheDocument();
});

test("renders search box", () => {
  render(<ChooseStaticDataset />, {
    wrapper: MemoryRouter,
  });
  expect(screen.getByRole("searchbox", { name: "Search" })).toBeInTheDocument();
});

test("renders a selet and continue button", () => {
  render(<ChooseStaticDataset />, {
    wrapper: MemoryRouter,
  });
  expect(
    screen.getByRole("button", { name: "Select and continue" })
  ).toBeInTheDocument();
});

test("renders a cancel button", () => {
  render(<ChooseStaticDataset />, {
    wrapper: MemoryRouter,
  });
  expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
});
