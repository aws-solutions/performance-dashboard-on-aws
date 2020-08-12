import React from "react";
import { render, fireEvent, act, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import BadgerService from "../../services/BadgerService";
import EditDetails from "../EditDetails";

jest.mock("../../hooks");
jest.mock("../../services/BadgerService");

const history = createMemoryHistory();

describe("EditDetailsForm", () => {
  beforeEach(async () => {
    // Mocks
    jest.spyOn(history, "push");
    BadgerService.fetchDashboardById = jest.fn().mockReturnValue({ id: "123", name: "test", topicAreaId: "456", description: "description test" });

    await act(async () => {
      render(
        <Router history={history}>
            <EditDetails />
        </Router>
      );
    });
  });

  test("submits form with the entered values", async () => {
    await act(async () => {
      fireEvent.submit(screen.getByTestId("EditDetailsForm"));
    });

    expect(BadgerService.editDashboard).toBeCalledWith(
      "123",
      "test",
      "456",
      "description test"
    );
  });

  test("invokes cancel function when use clicks cancel", async () => {
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    });
    expect(history.push).toHaveBeenCalledWith("/admin/dashboard/edit/123");
  });
});
