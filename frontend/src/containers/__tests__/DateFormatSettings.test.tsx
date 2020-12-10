import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DateFormatSettings from "../DateFormatSettings";

jest.mock("../../hooks");

const mockDayJs = jest.fn();
jest.mock("dayjs", () =>
  jest.fn(() => {
    const dayjs = jest.requireActual("dayjs");
    return dayjs("2020-12-09 03:30:00");
  })
);

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
  mockDayJs.mockReturnValueOnce({
    format: jest.fn().mockReturnValueOnce("03:30"),
  });
  const timeFormat = screen.getByText("03:30 (hh:mm)");
  expect(timeFormat).toBeInTheDocument();
});
