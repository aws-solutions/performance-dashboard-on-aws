import React from "react";
import { render, fireEvent, act, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Route, Router } from "react-router-dom";
import BackendService from "../../services/BackendService";
import EditSupportContactEmail from "../EditSupportContactEmail";
import userEvent from "@testing-library/user-event";

jest.mock("../../hooks");
jest.mock("../../services/BackendService");

const history = createMemoryHistory();
history.push("/admin/settings/supportcontact/edit");
jest.spyOn(history, "push");

beforeEach(async () => {
  await act(async () => {
    render(
      <Router history={history}>
        <Route path="/admin/settings/supportcontact/edit">
          <EditSupportContactEmail />
        </Route>
      </Router>
    );
  });
});

test("submits form with the entered values", async () => {
  userEvent.clear(screen.getByLabelText("Support Contact Email Address"));
  userEvent.type(
    screen.getByLabelText("Support Contact Email Address"),
    "test1234@hotmail.com"
  );

  await act(async () => {
    fireEvent.submit(screen.getByTestId("EditSupportContactEmailForm"));
  });

  expect(BackendService.updateSetting).toBeCalledWith(
    "adminContactEmailAddress",
    "test1234@hotmail.com",
    expect.anything()
  );
});

test("invokes cancel function when use clicks cancel", async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  });
  expect(history.push).toHaveBeenCalledWith("/admin/settings/adminsite");
});
