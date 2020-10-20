import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PublishDashboard from "../PublishDashboard";

jest.mock("../../hooks");

test("renders dashboard title", () => {
  const { getByRole } = render(<PublishDashboard />, {
    wrapper: MemoryRouter,
  });
  expect(
    getByRole("heading", { name: "My AWS Dashboard" })
  ).toBeInTheDocument();
});
