import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddChart from "../AddChart";

test("renders title and subtitles", async () => {
  const { getByText } = render(<AddChart />, { wrapper: MemoryRouter });
  expect(getByText("Add content")).toBeInTheDocument();
  expect(getByText("Configure chart")).toBeInTheDocument();
  expect(getByText("Step 2 of 2")).toBeInTheDocument();
});

test("renders a textfield for chart title", async () => {
  const { getByLabelText } = render(<AddChart />, { wrapper: MemoryRouter });
  expect(getByLabelText("Chart title")).toBeInTheDocument();
});

test("renders a file upload input", async () => {
  const { getByLabelText } = render(<AddChart />, { wrapper: MemoryRouter });
  expect(getByLabelText("File upload")).toBeInTheDocument();
});
