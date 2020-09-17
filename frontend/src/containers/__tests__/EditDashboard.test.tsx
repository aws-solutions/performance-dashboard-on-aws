import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { MemoryRouter, Router } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faGripLinesVertical,
  faCaretUp,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";

import EditDashboard from "../EditDashboard";
import BadgerService from "../../services/BadgerService";

library.add(faGripLinesVertical, faCaretUp, faCaretDown);

jest.mock("../../hooks");
jest.mock("../../services/BadgerService");

test("renders the name of the dashboard", async () => {
  const { findByText } = render(<EditDashboard />, { wrapper: MemoryRouter });
  const name = await findByText("My AWS Dashboard");
  expect(name).toBeInTheDocument();
});

test("renders the topic area as subtitle", async () => {
  const { findByText } = render(<EditDashboard />, { wrapper: MemoryRouter });
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

  const editDetails = await findByRole("link", { name: "Edit details" });
  fireEvent.click(editDetails);
  expect(history.push).toHaveBeenCalledWith(
    "/admin/dashboard/edit/123/details"
  );
});

test("moving up a widget calls api to set widget order", async () => {
  const history = createMemoryHistory();
  BadgerService.setWidgetOrder = jest.fn();

  const { getByRole } = render(
    <Router history={history}>
      <EditDashboard />
    </Router>
  );

  await act(async () => {
    // Dummy text widget is defined in hooks/__mocks__/index.tsx
    fireEvent.click(getByRole("button", { name: "Move Dummy text widget up" }));
  });

  expect(BadgerService.setWidgetOrder).toBeCalled();
});
