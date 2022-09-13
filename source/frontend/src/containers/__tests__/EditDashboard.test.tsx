import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { MemoryRouter, Router } from "react-router-dom";

import EditDashboard from "../EditDashboard";
import BackendService from "../../services/BackendService";

jest.mock("../../hooks");
jest.mock("../../services/BackendService");

test("renders the name of the dashboard", async () => {
  const { getByRole } = render(<EditDashboard />, {
    wrapper: MemoryRouter,
  });
  const name = getByRole("heading", {
    name: "My AWS Dashboard",
  });
  expect(name).toBeInTheDocument();
});

test("renders the topic area as subtitle", async () => {
  const { findByText } = render(<EditDashboard />, {
    wrapper: MemoryRouter,
  });
  const subtitle = await findByText("Bananas");
  expect(subtitle).toBeInTheDocument();
});

test("edit details link takes you to details screen", async () => {
  const history = createMemoryHistory();
  jest.spyOn(history, "push");

  const { findByRole } = render(
    <Router history={history}>
      <EditDashboard />
    </Router>
  );

  const editHeader = await findByRole("link", {
    name: "Edit header",
  });
  fireEvent.click(editHeader);
  expect(history.push).toHaveBeenCalledWith("/admin/dashboard/edit/123/header");
});

test("moving down a widget calls api to set widget order", async () => {
  const history = createMemoryHistory();
  BackendService.setWidgetOrder = jest.fn();

  const { getByRole } = render(
    <Router history={history}>
      <EditDashboard />
    </Router>
  );

  await act(async () => {
    // Dummy text widget is defined in hooks/__mocks__/index.tsx
    fireEvent.click(
      getByRole("button", {
        name: "Move Dummy text widget down",
      })
    );
  });

  expect(BackendService.setWidgetOrder).toBeCalled();
});
