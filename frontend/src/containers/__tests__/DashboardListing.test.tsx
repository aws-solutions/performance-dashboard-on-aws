import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardListing from "../DashboardListing";

jest.mock("../../hooks");

test("renders a textfield Dashboards", async () => {
  const { getByText } = render(<DashboardListing />, {
    wrapper: MemoryRouter,
  });
  expect(getByText("Dashboards")).toBeInTheDocument();
});

test("renders the tabs", async () => {
  const { getByText } = render(<DashboardListing />, {
    wrapper: MemoryRouter,
  });
  expect(getByText("Drafts (1)")).toBeInTheDocument();
  expect(getByText("Published (1)")).toBeInTheDocument();
});

test("renders a dropdown menu", async () => {
  const { getByText } = render(<DashboardListing />, {
    wrapper: MemoryRouter,
  });
  expect(getByText("Actions")).toBeInTheDocument();
});

test("renders a button to create dashboard", async () => {
  const { getByRole } = render(<DashboardListing />, {
    wrapper: MemoryRouter,
  });
  const button = getByRole("button", { name: "Create dashboard" });
  expect(button).toBeInTheDocument();
});

test("renders a dashboard table", async () => {
  const { getByRole } = render(<DashboardListing />, {
    wrapper: MemoryRouter,
  });

  const dashboard1 = getByRole("link", { name: "Dashboard One" });
  expect(dashboard1).toBeInTheDocument();
});

test("filters dashboards based on name search input", async () => {
  const { getByLabelText, getByRole } = render(<DashboardListing />, {
    wrapper: MemoryRouter,
  });

  let dashboard1 = getByRole("link", { name: "Dashboard One" });

  // Make sure the dashboard show up in the table
  expect(dashboard1).toBeInTheDocument();

  // Use search input to filter
  const search = getByLabelText("Search");
  await act(async () => {
    fireEvent.input(search, {
      target: {
        value: "Dashboard Two",
      },
    });

    const searchButton = getByRole("button", { name: "Search" });
    fireEvent.click(searchButton);
  });

  // Dashboard one should dissapear
  expect(dashboard1).not.toBeInTheDocument();

  await act(async () => {
    fireEvent.input(search, {
      target: {
        value: "Dashboard One",
      },
    });

    const searchButton = getByRole("button", { name: "Search" });
    fireEvent.click(searchButton);
  });

  dashboard1 = getByRole("link", { name: "Dashboard One" });

  // Dashboard one should appear
  expect(dashboard1).toBeInTheDocument();
});

test("filters dashboards based on topic area name search input", async () => {
  const { getByLabelText, getByRole, getByText } = render(
    <DashboardListing />,
    {
      wrapper: MemoryRouter,
    }
  );

  let dashboard1 = getByText("Topic Area Bananas");

  // Make sure the dashboard show up in the table
  expect(dashboard1).toBeInTheDocument();

  // Use search input to filter
  const search = getByLabelText("Search");
  await act(async () => {
    fireEvent.input(search, {
      target: {
        value: "Topic Area Grapes",
      },
    });

    const searchButton = getByRole("button", { name: "Search" });
    fireEvent.click(searchButton);
  });

  // Dashboard one should dissapear
  expect(dashboard1).not.toBeInTheDocument();

  await act(async () => {
    fireEvent.input(search, {
      target: {
        value: "Topic Area Bananas",
      },
    });

    const searchButton = getByRole("button", { name: "Search" });
    fireEvent.click(searchButton);
  });

  dashboard1 = getByText("Topic Area Bananas");

  // Dashboard one should appear
  expect(dashboard1).toBeInTheDocument();
});

test("filters dashboards based on createdBy search input", async () => {
  const { getByLabelText, getByRole, getByText } = render(
    <DashboardListing />,
    {
      wrapper: MemoryRouter,
    }
  );

  let dashboard1 = getByText("test user");

  // Make sure the dashboard show up in the table
  expect(dashboard1).toBeInTheDocument();

  // Use search input to filter
  const search = getByLabelText("Search");
  await act(async () => {
    fireEvent.input(search, {
      target: {
        value: "another test user",
      },
    });

    const searchButton = getByRole("button", { name: "Search" });
    fireEvent.click(searchButton);
  });

  // Dashboard one should dissapear
  expect(dashboard1).not.toBeInTheDocument();

  await act(async () => {
    fireEvent.input(search, {
      target: {
        value: "test user",
      },
    });

    const searchButton = getByRole("button", { name: "Search" });
    fireEvent.click(searchButton);
  });

  dashboard1 = getByText("test user");

  // Dashboard one should appear
  expect(dashboard1).toBeInTheDocument();
});

test("renders a publish queue tab", async () => {
  const { getByText } = render(<DashboardListing />, {
    wrapper: MemoryRouter,
  });

  expect(getByText("Publish queue (0)")).toBeInTheDocument();
});

test("renders an archived tab", async () => {
  const { getByText } = render(<DashboardListing />, {
    wrapper: MemoryRouter,
  });

  expect(getByText("Archived (0)")).toBeInTheDocument();
});
