import React from "react";
import { render, fireEvent, act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Route, Router } from "react-router-dom";
import BackendService from "../../services/BackendService";
import EditAnalytics from "../EditAnalytics";

jest.mock("../../hooks");
jest.mock("../../services/BackendService");

const history = createMemoryHistory();
history.push("/admin/settings/publishedsite/analyticsedit");
jest.spyOn(history, "push");

beforeEach(async () => {
  await act(async () => {
    render(
      <Router history={history}>
        <Route path="/admin/settings/publishedsite/analyticsedit">
          <EditAnalytics />
        </Route>
      </Router>
    );
  });
});

test("submits the analytics tracking id", async () => {
  userEvent.clear(
    screen.getByLabelText("Google Universal Analytics tracking ID*")
  );
  userEvent.type(
    screen.getByLabelText("Google Universal Analytics tracking ID*"),
    "UA12345"
  );

  await act(async () => {
    fireEvent.submit(screen.getByTestId("EditAnalyticsForm"));
  });

  expect(BackendService.updateSetting).toBeCalledTimes(1);
  expect(BackendService.updateSetting).toHaveBeenCalledWith(
    "analyticsTrackingId",
    "UA12345",
    expect.anything()
  );
});

test("clears and saves the analytics tracking id", async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Clear and Save" }));
  });
  expect(BackendService.updateSetting).toBeCalledTimes(1);
  expect(BackendService.updateSetting).toHaveBeenCalledWith(
    "analyticsTrackingId",
    "NA",
    expect.anything()
  );
});

test("invokes the cancel function when user clicks cancel", async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  });
  expect(history.push).toHaveBeenCalledWith("/admin/settings/publishedsite");
});
