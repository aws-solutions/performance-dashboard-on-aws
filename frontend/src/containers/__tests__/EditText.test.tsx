/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { MemoryRouter, Router } from "react-router-dom";
import BackendService from "../../services/BackendService";
import EditText from "../EditText";
import { createMemoryHistory } from "history";

jest.mock("../../services/BackendService");
jest.mock("../../hooks");

beforeEach(() => {
  BackendService.editWidget = jest.fn();
});

test("renders title", async () => {
  const { getByRole } = render(<EditText />, {
    wrapper: MemoryRouter,
  });
  expect(getByRole("heading", { name: "Edit text" })).toBeInTheDocument();
});

test("renders a text input for title", async () => {
  const { getByLabelText } = render(<EditText />, { wrapper: MemoryRouter });
  expect(getByLabelText("Text title*")).toBeInTheDocument();
});

test("renders a text input for content", async () => {
  const { getByLabelText } = render(<EditText />, { wrapper: MemoryRouter });
  expect(getByLabelText("Text*")).toBeInTheDocument();
});

test("renders the expand preview button", async () => {
  const { getByRole } = render(<EditText />, { wrapper: MemoryRouter });
  expect(getByRole("button", { name: "Expand preview" })).toBeInTheDocument();
});

test("on submit, it calls editWidget api", async () => {
  const { getByRole, getByLabelText } = render(<EditText />, {
    wrapper: MemoryRouter,
  });

  fireEvent.input(getByLabelText("Text title*"), {
    target: {
      value: "Content title goes here",
    },
  });

  fireEvent.change(getByLabelText("Text*"), {
    target: {
      value: "Text content here",
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
      <EditText />
    </Router>
  );

  await act(async () => {
    const cancelButton = await findByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);
  });

  expect(history.push).toHaveBeenCalledWith("/admin/dashboard/edit/undefined");
});
