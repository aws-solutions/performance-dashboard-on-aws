import React from "react";
import { render, RenderResult, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BackendService from "../../services/BackendService";
import PublishDashboard from "../PublishDashboard";

jest.mock("../../services/BackendService");
jest.mock("../../hooks");

let wrapper: RenderResult;
beforeEach(() => {
  wrapper = render(<PublishDashboard />, {
    wrapper: MemoryRouter,
  });
});

test("renders dashboard title", () => {
  expect(
    wrapper.getByRole("heading", {
      name: "My AWS Dashboard",
    })
  ).toBeInTheDocument();
});

test("renders topic area", () => {
  expect(wrapper.getByText("Bananas")).toBeInTheDocument();
});

test("renders step indicator in step 1", () => {
  expect(
    wrapper.getByRole("heading", { name: "Step 1 of 2 Internal version notes" })
  ).toBeInTheDocument();
});

test("continue button advances to step 2", async () => {
  fireEvent.input(wrapper.getByLabelText("Internal release notes"), {
    target: {
      value: "Some release notes",
    },
  });

  await act(async () => {
    fireEvent.click(
      wrapper.getByRole("button", {
        name: "Continue",
      })
    );
  });

  expect(
    wrapper.getByRole("heading", {
      name: "Step 2 of 2 Review and publish",
    })
  ).toBeInTheDocument();
});

test("publish button invokes BackendService", async () => {
  fireEvent.input(wrapper.getByLabelText("Internal release notes"), {
    target: {
      value: "Some release notes",
    },
  });

  fireEvent.click(
    wrapper.getByRole("button", {
      name: "Continue",
    })
  );

  await act(async () => {
    fireEvent.click(wrapper.getByLabelText("Acknowledgement"));
  });

  await act(async () => {
    fireEvent.click(
      wrapper.getByRole("button", {
        name: "Publish",
      })
    );
  });

  expect(BackendService.publishDashboard).toBeCalled();
});

test("return to draft button invokes BackendService", async () => {
  await act(async () => {
    fireEvent.click(
      wrapper.getByRole("button", {
        name: "Return to draft",
      })
    );
  });
  expect(BackendService.moveToDraft).toBeCalled();
});
