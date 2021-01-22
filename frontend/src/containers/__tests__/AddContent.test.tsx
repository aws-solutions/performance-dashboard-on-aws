import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { MemoryRouter, Router } from "react-router-dom";
import AddContent from "../AddContent";

test("renders Add content", async () => {
  const { getByRole } = render(<AddContent />, { wrapper: MemoryRouter });
  const addContent = await getByRole("heading", { name: "Add content item" });
  expect(addContent).toBeInTheDocument();
});

test("renders Step 1 of 2", async () => {
  const { findByText } = render(<AddContent />, { wrapper: MemoryRouter });
  const stepOneOfTwo = await findByText("Step 1 of 2");
  expect(stepOneOfTwo).toBeInTheDocument();
});

test("renders text option", async () => {
  const { findByText } = render(<AddContent />, { wrapper: MemoryRouter });
  const header = await findByText("Text");
  const description = await findByText(
    "Add a formatted block of text. Input supports Markdown including links, bullets, bolding, and headings."
  );
  expect(header).toBeInTheDocument();
  expect(description).toBeInTheDocument();
});

test("renders chart option", async () => {
  const { findByText } = render(<AddContent />, { wrapper: MemoryRouter });
  const header = await findByText("Chart");
  const description = await findByText(
    "Upload a CSV file to display data as a visualization, including line, bar, column and part-to-whole charts."
  );
  expect(header).toBeInTheDocument();
  expect(description).toBeInTheDocument();
});

test("renders table option", async () => {
  const { findByText } = render(<AddContent />, { wrapper: MemoryRouter });
  const header = await findByText("Table");
  const description = await findByText(
    "Upload a CSV file to display data formatted in rows and columns."
  );
  expect(header).toBeInTheDocument();
  expect(description).toBeInTheDocument();
});

test("renders image option", async () => {
  const { findByText } = render(<AddContent />, { wrapper: MemoryRouter });
  const header = await findByText("Image");
  const description = await findByText("Upload an image to display.");
  expect(header).toBeInTheDocument();
  expect(description).toBeInTheDocument();
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
