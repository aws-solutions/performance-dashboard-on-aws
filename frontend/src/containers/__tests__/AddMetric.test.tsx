import React from "react";
import { render, fireEvent, act, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import AddMetric from "../AddMetric";

jest.mock("../../hooks");
jest.mock("../../services/BackendService");

const history = createMemoryHistory();

describe("AddMetricForm", () => {
  beforeEach(async () => {
    // Mocks
    history.location.state = {
      ...(history.location.state || Object.create({})),
      metrics: [],
    };
    jest.spyOn(history, "push");

    render(
      <Router history={history}>
        <AddMetric />
      </Router>
    );
  });

  test("renders title", async () => {
    expect(
      await screen.findByRole("heading", { name: "Add metric" })
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
      fireEvent.submit(screen.getByTestId("AddMetricForm"));
    });

    expect(history.push).toBeCalledWith(
      "/admin/dashboard/undefined/add-metrics",
      {
        alert: { message: "Metric successfully added.", type: "success" },
        metricTitle: "",
        metrics: [
          {
            changeOverTime: "",
            endDate: "",
            startDate: "",
            title: "Test metric",
            value: "1.0",
            percentage: "",
            currency: "",
          },
        ],
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
        metrics: [],
        oneMetricPerRow: false,
        showTitle: true,
      }
    );
  });
});
