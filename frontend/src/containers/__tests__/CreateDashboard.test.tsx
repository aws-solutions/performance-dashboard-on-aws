import React from "react";
import { render, fireEvent, act, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { MemoryRouter, Router } from "react-router-dom";
import BackendService from "../../services/BackendService";
import CreateDashboard from "../CreateDashboard";

jest.mock("../../hooks");
jest.mock("../../services/BackendService");

const history = createMemoryHistory();

describe("CreateDashboardForm", () => {
  beforeEach(async () => {
    // Mocks
    jest.spyOn(history, "push");
    BackendService.createDashboard = jest.fn().mockReturnValue({ id: "123" });

    render(
      <Router history={history}>
        <CreateDashboard />
      </Router>
    );
  });

  test("submits form with the entered values", async () => {
    fireEvent.input(screen.getByLabelText("Dashboard Name"), {
      target: {
        value: "AWS Dashboard",
      },
    });

    fireEvent.input(screen.getByLabelText("Ministry"), {
      target: {
        value: "123456789",
      },
    });

    await act(async () => {
      fireEvent.submit(screen.getByTestId("CreateDashboardForm"));
    });

    expect(BackendService.createDashboard).toBeCalledWith(
      "AWS Dashboard",
      "123456789",
      ""
    );
  });

  test("invokes cancel function when use clicks cancel", async () => {
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    });
    expect(history.push).toHaveBeenCalledWith("/admin/dashboards");
  });

  test("edit details should match snapshot", async () => {
    const wrapper = render(<CreateDashboard />, { wrapper: MemoryRouter });
    expect(wrapper.container).toMatchSnapshot();
  });
});
