import React from "react";
import { render, fireEvent, act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Route, Router } from "react-router-dom";
import BackendService from "../../services/BackendService";
import EditColors from "../EditColors";

jest.mock("../../hooks");
jest.mock("../../services/BackendService");

const history = createMemoryHistory();
history.push("/admin/settings/brandingandstyling/editcolors");
jest.spyOn(history, "push");

beforeEach(async () => {
  await act(async () => {
    render(
      <Router history={history}>
        <Route path="/admin/settings/brandingandstyling/editcolors">
          <EditColors />
        </Route>
      </Router>
    );
  });
});

test("submits form with the entered values", async () => {
  userEvent.clear(screen.getByLabelText("Primary color"));
  userEvent.type(screen.getByLabelText("Primary color"), "#00ff00");

  userEvent.clear(screen.getByLabelText("Data visualization second color"));
  userEvent.type(
    screen.getByLabelText("Data visualization second color"),
    "#0f6460"
  );

  await act(async () => {
    fireEvent.submit(screen.getByTestId("EditColorsForm"));
  });

  expect(BackendService.updateSetting).toBeCalledTimes(1);
  expect(BackendService.updateSetting).toHaveBeenCalledWith(
    "colors",
    {
      primary: "#00ff00",
      secondary: "#0f6460",
    },
    expect.anything()
  );
});

test("invokes cancel function when use clicks cancel", async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  });
  expect(history.push).toHaveBeenCalledWith(
    "/admin/settings/brandingandstyling"
  );
});
