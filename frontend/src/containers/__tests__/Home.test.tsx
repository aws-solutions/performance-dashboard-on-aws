import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../Home";

jest.mock("../../hooks");

test("renders homepage title", async () => {
  const { getByRole } = render(<Home />, {
    wrapper: MemoryRouter,
  });
  expect(
    getByRole("heading", { name: "Kingdom of Wakanda" })
  ).toBeInTheDocument();
});

test("renders homepage description", async () => {
  const { getByText } = render(<Home />, { wrapper: MemoryRouter });
  expect(getByText("Welcome to our dashboard")).toBeInTheDocument();
});
