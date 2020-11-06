import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { MemoryRouter, Router } from "react-router-dom";
import AddContent from "../AddContent";

test("renders Add content", async () => {
  const { getByRole } = render(<AddContent />, { wrapper: MemoryRouter });
  const addContent = await getByRole("heading", { name: "Add content" });
  expect(addContent).toBeInTheDocument();
});

test("renders Step 1 of 2", async () => {
  const { findByText } = render(<AddContent />, { wrapper: MemoryRouter });
  const stepOneOfTwo = await findByText("Step 1 of 2");
  expect(stepOneOfTwo).toBeInTheDocument();
});

test("cancel link takes you to Edit Dashboard screen", async () => {
  const history = createMemoryHistory();
  jest.spyOn(history, "push");

  const { findByRole } = render(
    <Router history={history}>
      <AddContent />
    </Router>
  );

  await act(async () => {
    const cancelButton = await findByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);
  });

  expect(history.push).toHaveBeenCalledWith("/admin/dashboard/edit/undefined");
});
