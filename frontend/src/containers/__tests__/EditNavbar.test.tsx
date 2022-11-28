/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, fireEvent, act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Route, Router } from "react-router-dom";
import BackendService from "../../services/BackendService";
import EditNavbar from "../EditNavbar";

jest.mock("../../hooks");
jest.mock("../../services/BackendService");

const history = createMemoryHistory();
history.push("/admin/settings/publishedsite/navbaredit");
jest.spyOn(history, "push");

beforeEach(async () => {
  await act(async () => {
    render(
      <Router history={history}>
        <Route path="/admin/settings/publishedsite/navbaredit">
          <EditNavbar />
        </Route>
      </Router>
    );
  });
});

test("submits form with the entered values", async () => {
  userEvent.clear(screen.getByLabelText("Title*"));
  userEvent.type(screen.getByLabelText("Title*"), "A title for your navbar");

  userEvent.clear(screen.getByLabelText("Contact email address*"));
  userEvent.type(
    screen.getByLabelText("Contact email address*"),
    "test1234@example.com"
  );

  userEvent.clear(screen.getByLabelText("Contact us*"));
  userEvent.type(screen.getByLabelText("Contact us*"), "something");

  await act(async () => {
    fireEvent.submit(screen.getByTestId("EditNavbarForm"));
  });

  expect(BackendService.updateSetting).toBeCalledTimes(3);
  expect(BackendService.updateSetting).toHaveBeenNthCalledWith(
    1,
    "navbarTitle",
    "A title for your navbar",
    expect.anything()
  );
  expect(BackendService.updateSetting).toHaveBeenNthCalledWith(
    2,
    "contactEmailAddress",
    "test1234@example.com",
    expect.anything()
  );
  expect(BackendService.updateSetting).toHaveBeenNthCalledWith(
    3,
    "contactUsContent",
    "something",
    expect.anything()
  );
});

test("invokes cancel function when use clicks cancel", async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  });
  expect(history.push).toHaveBeenCalledWith("/admin/settings/publishedsite");
});
