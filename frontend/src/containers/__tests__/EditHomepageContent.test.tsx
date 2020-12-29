import React from "react";
import { render, fireEvent, act, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Route, Router } from "react-router-dom";
import BackendService from "../../services/BackendService";
import EditHomepageContent from "../EditHomepageContent";

jest.mock("../../hooks");
jest.mock("../../services/BackendService");

const history = createMemoryHistory();
history.push("/admin/settings/publishedsite/edit");
jest.spyOn(history, "push");

beforeEach(async () => {
  await act(async () => {
    render(
      <Router history={history}>
        <Route path="/admin/settings/publishedsite/edit">
          <EditHomepageContent />
        </Route>
      </Router>
    );
  });
});

test("submits form with the entered values", async () => {
  await act(async () => {
    fireEvent.submit(screen.getByTestId("EditHomepageContentForm"));
  });

  expect(BackendService.editHomepage).toBeCalledWith(
    "Kingdom of Wakanda",
    "Welcome to our dashboard",
    ""
  );
});

test("invokes cancel function when use clicks cancel", async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  });
  expect(history.push).toHaveBeenCalledWith("/admin/settings/publishedsite");
});
