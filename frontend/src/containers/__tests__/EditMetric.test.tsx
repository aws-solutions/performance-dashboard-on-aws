import React from "react";
import { render, fireEvent, act, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Route, Router } from "react-router-dom";
import EditMetric from "../EditMetric";

jest.mock("../../hooks");
jest.mock("../../services/BackendService");

const history = createMemoryHistory();

describe("EditMetricForm", () => {
  beforeEach(async () => {
    history.location.state = {
      ...history.location.state,
      metrics: [{ title: "test title", value: "test value" }],
      metric: { title: "test title", value: "test value" },
    };
    jest.spyOn(history, "push");

    render(
      <Router history={history}>
        <EditMetric />
      </Router>
    );
  });

  test("renders title", async () => {
    expect(
      await screen.findByRole("heading", { name: "Edit metric" })
    ).toBeInTheDocument();
  });

  test("submits form with the entered values", async () => {
    fireEvent.input(screen.getByLabelText("Metric title"), {
      target: {
        value: "Test metric",
      },
    });

    fireEvent.input(screen.getByLabelText("Metric value"), {
      target: {
        value: "1.0",
      },
    });

    await act(async () => {
      fireEvent.submit(screen.getByTestId("EditMetricForm"));
    });

    expect(history.push).toHaveBeenCalledWith(
      "/admin/dashboard/undefined/add-metrics",
      {
        alert: { message: "Metric successfully edited.", type: "success" },
        metricTitle: "",
        metrics: [{ title: "test title", value: "test value" }],
        oneMetricPerRow: false,
        showTitle: true,
      }
    );
  });

  test("invokes cancel function when use clicks cancel", async () => {
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    });
    expect(history.push).toHaveBeenCalledWith(
      "/admin/dashboard/undefined/add-metrics",
      {
        metricTitle: "",
        metrics: [{ title: "test title", value: "test value" }],
        oneMetricPerRow: false,
        showTitle: true,
      }
    );
  });
});
