import React from "react";
import {
  render,
  fireEvent,
  act,
  screen,
  waitFor,
} from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Route, Router } from "react-router-dom";
import BackendService from "../../services/BackendService";
import EditDetails from "../EditDetails";

jest.mock("../../hooks");
jest.mock("../../services/BackendService");

const history = createMemoryHistory();
history.push("/admin/dashboard/edit/123/header");
jest.spyOn(history, "push");

beforeEach(async () => {
  await act(async () => {
    render(
      <Router history={history}>
        <Route path="/admin/dashboard/edit/:dashboardId/header">
          <EditDetails />
        </Route>
      </Router>
    );
  });
});

test("submits form with the entered values", async () => {
  await act(async () => {
    fireEvent.submit(screen.getByTestId("EditDetailsForm"));
  });

  expect(BackendService.editDashboard).toBeCalledWith(
    "123",
    "My AWS Dashboard",
    "123456789",
    false,
    "Some description",
    ""
  );
});

test("invokes cancel function when use clicks cancel", async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  });
  expect(history.push).toHaveBeenCalledWith("/admin/dashboard/edit/123");
});

test("renders a preview of dashboard name and description", async () => {
  fireEvent.input(screen.getByLabelText("Dashboard Name"), {
    target: {
      value: "Foo Bar",
    },
  });

  fireEvent.input(screen.getByLabelText("Description - optional"), {
    target: {
      value: "FizzBuzz",
    },
  });

  const description = screen.getByText("FizzBuzz");
  const name = screen.getByRole("heading", { name: "Foo Bar" });

  await waitFor(() => expect(name).toBeInTheDocument());
  await waitFor(() => expect(description).toBeInTheDocument());
});
