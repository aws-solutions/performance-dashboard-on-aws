import React from "react";
import { render, fireEvent, act, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import BackendService from "../../services/BackendService";
import CreateTopicArea from "../CreateTopicArea";

jest.mock("../../hooks");
jest.mock("../../services/BackendService");

const history = createMemoryHistory();

describe("CreateTopicAreaForm", () => {
  beforeEach(async () => {
    // Mocks
    jest.spyOn(history, "push");
    BackendService.createTopicArea = jest.fn().mockReturnValue({ id: "123" });

    render(
      <Router history={history}>
        <CreateTopicArea />
      </Router>
    );
  });

  test("submits form with the entered values", async () => {
    fireEvent.input(screen.getByLabelText("Topic area name"), {
      target: {
        value: "AWS Topic Area",
      },
    });

    await act(async () => {
      fireEvent.submit(screen.getByTestId("CreateTopicAreaForm"));
    });

    expect(BackendService.createTopicArea).toBeCalledWith("AWS Topic Area");
  });

  test("invokes cancel function when use clicks cancel", async () => {
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    });
    expect(history.push).toHaveBeenCalledWith("/admin/settings/topicarea");
  });
});
