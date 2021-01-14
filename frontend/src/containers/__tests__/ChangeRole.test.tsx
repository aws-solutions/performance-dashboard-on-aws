import React from "react";
import { render, fireEvent, act, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import BackendService from "../../services/BackendService";
import ChangeRole from "../ChangeRole";

jest.mock("../../hooks");
jest.mock("../../services/BackendService");

const history = createMemoryHistory();

describe("ChangeRoleForm", () => {
  beforeEach(async () => {
    // Mocks
    history.location.state = {
      ...history.location.state,
      emails: "test@test.com",
    };
    jest.spyOn(history, "push");
    BackendService.createDashboard = jest.fn();

    render(
      <Router history={history}>
        <ChangeRole />
      </Router>
    );
  });

  test("submits form with the entered values", async () => {
    fireEvent.input(screen.getByLabelText("Admin"), {
      target: {
        checked: true,
      },
    });

    await act(async () => {
      fireEvent.submit(screen.getByTestId("ChangeRoleForm"));
    });

    expect(BackendService.changeRole).toBeCalledWith("Admin", [
      "test@test.com",
    ]);
  });

  test("invokes cancel function when use clicks cancel", async () => {
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    });
    expect(history.push).toHaveBeenCalledWith("/admin/users");
  });
});
