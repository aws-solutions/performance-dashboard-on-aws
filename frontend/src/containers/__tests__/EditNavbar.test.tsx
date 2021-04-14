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
  userEvent.clear(screen.getByLabelText("Title"));
  userEvent.type(screen.getByLabelText("Title"), "A title for your navbar");

  await act(async () => {
    fireEvent.submit(screen.getByTestId("EditNavbarForm"));
  });

  expect(BackendService.updateSetting).toBeCalledTimes(2);
  expect(BackendService.updateSetting).toHaveBeenCalledWith(
    "navbarTitle",
    "A title for your navbar",
    expect.anything()
  );
});

test("invokes cancel function when use clicks cancel", async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  });
  expect(history.push).toHaveBeenCalledWith("/admin/settings/publishedsite");
});
