import React from "react";
import { render, fireEvent, act, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Route, Router } from "react-router-dom";
import BackendService from "../../services/BackendService";
import EditPublishingGuidance from "../EditPublishingGuidance";

jest.mock("../../hooks");
jest.mock("../../services/BackendService");

const history = createMemoryHistory();

beforeEach(async () => {
  history.push("/admin/settings/publishingguidance/edit");
  jest.spyOn(history, "push");

  await act(async () => {
    render(
      <Router history={history}>
        <Route path="/admin/settings/publishingguidance/edit">
          <EditPublishingGuidance />
        </Route>
      </Router>
    );
  });
});

test("submits form with the entered values", async () => {
  await act(async () => {
    fireEvent.submit(screen.getByTestId("EditPublishingGuidanceForm"));
  });

  expect(BackendService.editSettings).toBeCalledWith(
    "I acknowledge that I have reviewed the dashboard and it is ready to publish",
    ""
  );
});

test("invokes cancel function when use clicks cancel", async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  });
  expect(history.push).toHaveBeenCalledWith(
    "/admin/settings/publishingguidance"
  );
});
