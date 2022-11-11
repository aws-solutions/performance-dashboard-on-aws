import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { MemoryRouter, Router } from "react-router-dom";
import BackendService from "../../services/BackendService";
import EditSection from "../EditSection";
import { createMemoryHistory } from "history";

jest.mock("../../services/BackendService");
jest.mock("../../hooks");

beforeEach(() => {
  BackendService.editWidget = jest.fn();
});

test("renders title", async () => {
  const { getByText, getByRole, getByLabelText } = render(<EditSection />, {
    wrapper: MemoryRouter,
  });
  expect(getByRole("heading", { name: "Edit section" })).toBeInTheDocument();
  expect(getByText("Configure section content")).toBeInTheDocument();
  expect(getByLabelText("Section title*")).toBeInTheDocument();
  expect(getByLabelText("Section summary (optional)")).toBeInTheDocument();
});

test("on submit, it calls editWidget api", async () => {
  const { getByRole, getByLabelText } = render(<EditSection />, {
    wrapper: MemoryRouter,
  });

  fireEvent.input(getByLabelText("Section title*"), {
    target: {
      value: "Content title goes here",
    },
  });

  await act(async () => {
    fireEvent.click(getByRole("button", { name: "Save" }));
  });

  expect(BackendService.editWidget).toHaveBeenCalled();
});

test("cancel link takes you to Edit Dashboard screen", async () => {
  const history = createMemoryHistory();
  jest.spyOn(history, "push");

  const { findByRole } = render(
    <Router history={history}>
      <EditSection />
    </Router>
  );

  await act(async () => {
    const cancelButton = await findByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);
  });

  expect(history.push).toHaveBeenCalledWith("/admin/dashboard/edit/undefined");
});
