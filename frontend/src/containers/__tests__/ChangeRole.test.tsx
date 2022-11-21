/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

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
      usernames: ["test1"],
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
    fireEvent.input(screen.getByTestId("adminRadioButton"), {
      target: {
        checked: true,
      },
    });

    await act(async () => {
      fireEvent.submit(screen.getByTestId("ChangeRoleForm"));
    });

    expect(BackendService.changeRole).toBeCalledWith("Admin", ["test1"]);
  });

  test("invokes cancel function when use clicks cancel", async () => {
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    });
    expect(history.push).toHaveBeenCalledWith("/admin/users");
  });
});
