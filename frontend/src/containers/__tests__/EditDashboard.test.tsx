import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { MemoryRouter, Router } from "react-router-dom";
import EditDashboard from "../EditDashboard";

/**
 * Mock useDashboard hook to return a dummy dashboard
 */
jest.mock("../../hooks", () => ({
  useDashboard: jest.fn().mockReturnValue({
    loading: false,
    dashboard: {
      id: "123",
      name: "My AWS Dashboard",
      topicAreaId: "abc",
      topicAreaName: "Bananas",
      description: "Dashboard that talks about bananas",
    },
  })
}));

test("renders the name and description of the dashboard", async () => {
  const { findByText } = render(<EditDashboard />, { wrapper: MemoryRouter });
  const name = await findByText("My AWS Dashboard");
  expect(name).toBeInTheDocument();
});

test("renders the topic area and description as subtitle", async () => {
  const { findByText } = render(<EditDashboard />, { wrapper: MemoryRouter });
  const subtitle = await findByText("Bananas | Dashboard that talks about bananas");
  expect(subtitle).toBeInTheDocument();
});

test("cancel button takes you back to dashboard home page", async () => {
  const history = createMemoryHistory();
  jest.spyOn(history, "push");

  const { findByRole } = render(
    <Router history={history}>
      <EditDashboard />
    </Router>
  );

  const cancelButton = await findByRole("button", { name: "Cancel" });
  fireEvent.click(cancelButton)
  expect(history.push).toHaveBeenCalledWith("/admin/dashboards");
});
