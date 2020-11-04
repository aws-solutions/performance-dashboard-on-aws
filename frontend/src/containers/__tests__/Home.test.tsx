import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
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

test("renders dashboards list", async () => {
  const { getByText } = render(<Home />, { wrapper: MemoryRouter });
  expect(getByText("Topic Area Bananas")).toBeInTheDocument();
  expect(getByText("Dashboard One")).toBeInTheDocument();
  expect(getByText("Topic Area Grapes")).toBeInTheDocument();
  expect(getByText("Dashboard Two")).toBeInTheDocument();
});

test("filters dashboards based on search input", async () => {
  const { getByLabelText, getByRole } = render(<Home />, {
    wrapper: MemoryRouter,
  });

  const dashboard1 = getByRole("link", { name: "Dashboard One" });
  const dashboard2 = getByRole("link", { name: "Dashboard Two" });

  // Make sure both dashboards show up in the table
  expect(dashboard1).toBeInTheDocument();
  expect(dashboard2).toBeInTheDocument();

  // Use search input to filter
  const search = getByLabelText("Search");
  await act(async () => {
    fireEvent.input(search, {
      target: {
        value: "Dashboard two",
      },
    });

    const searchButton = getByRole("button", { name: "Search" });
    fireEvent.click(searchButton);
  });

  // Dashboard one should dissapear
  expect(dashboard1).not.toBeInTheDocument();
  expect(dashboard2).toBeInTheDocument();
});
