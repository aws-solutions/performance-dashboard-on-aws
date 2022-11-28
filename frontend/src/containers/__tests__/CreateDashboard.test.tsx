/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  render,
  fireEvent,
  act,
  screen,
  waitFor,
} from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
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
    fireEvent.input(screen.getByLabelText("Dashboard Name*"), {
      target: {
        value: "AWS Dashboard",
      },
    });

    fireEvent.input(screen.getByLabelText("Ministry*"), {
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

  test("renders a preview of dashboard name and description", async () => {
    fireEvent.input(screen.getByLabelText("Dashboard Name*"), {
      target: {
        value: "Foo Bar",
      },
    });

    fireEvent.input(screen.getByLabelText("Description (optional)"), {
      target: {
        value: "FizzBuzz",
      },
    });

    const description = screen.getByText("FizzBuzz");
    const name = screen.getByRole("heading", { name: "Foo Bar" });

    await waitFor(() => expect(name).toBeInTheDocument());
    await waitFor(() => expect(description).toBeInTheDocument());
  });
});
