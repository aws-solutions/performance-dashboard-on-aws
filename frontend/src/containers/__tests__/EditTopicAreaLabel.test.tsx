import React from "react";
import { render, fireEvent, act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Route, Router } from "react-router-dom";
import BackendService from "../../services/BackendService";
import EditTopicAreaLabel from "../EditTopicAreaLabel";

jest.mock("../../hooks");
jest.mock("../../services/BackendService");

const history = createMemoryHistory();
history.push("/admin/settings/topicarea/editlabel");
jest.spyOn(history, "push");

beforeEach(async () => {
  await act(async () => {
    render(
      <Router history={history}>
        <Route path="/admin/settings/topicarea/editlabel">
          <EditTopicAreaLabel />
        </Route>
      </Router>
    );
  });
});

test("submits form with the entered values", async () => {
  userEvent.clear(screen.getByLabelText("Rename single 'topic area'*"));
  userEvent.type(
    screen.getByLabelText("Rename single 'topic area'*"),
    "Topic Area Test"
  );

  userEvent.clear(screen.getByLabelText("Rename multiple 'topic areas'*"));
  userEvent.type(
    screen.getByLabelText("Rename multiple 'topic areas'*"),
    "Topic Areas Test"
  );

  await act(async () => {
    fireEvent.submit(screen.getByTestId("EditTopicAreaLabelForm"));
  });

  expect(BackendService.updateSetting).toBeCalledTimes(1);
  expect(BackendService.updateSetting).toHaveBeenCalledWith(
    "topicAreaLabels",
    {
      plural: "Topic Areas Test",
      singular: "Topic Area Test",
    },
    expect.anything()
  );
});

test("invokes cancel function when use clicks cancel", async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  });
  expect(history.push).toHaveBeenCalledWith("/admin/settings/topicarea");
});
