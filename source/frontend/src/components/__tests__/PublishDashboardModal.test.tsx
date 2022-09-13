import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BackendService from "../../services/BackendService";
import PublishDashboardModal from "../PublishDashboardModal";

jest.mock("../../services/BackendService");
jest.mock("../../services/StorageService");
jest.mock("../../hooks");
jest.mock("papaparse");

const renderModal = async (open: boolean, closeModal?: Function) => {
  return render(
    <PublishDashboardModal
      isOpen={open}
      id="id"
      dashboardId="123"
      closeModal={closeModal ?? jest.fn()}
    />,
    {
      wrapper: MemoryRouter,
    }
  );
};

beforeEach(() => {
  BackendService.publishDashboard = jest.fn();
});

test("should render the dialog when close", async () => {
  await renderModal(true);
  expect(
    await screen.getByRole("heading", { name: "Publish Dashboard" })
  ).toBeInTheDocument();
});

test("renders a textfield for URL", async () => {
  renderModal(true);
  expect(await screen.findByLabelText("URL*")).toBeInTheDocument();
});

test("renders a textfield for internal version notes", async () => {
  renderModal(true);
  expect(
    await screen.findByLabelText("Internal version notes*")
  ).toBeInTheDocument();
});

test("renders a submit button", async () => {
  renderModal(true);
  expect(
    await screen.findByRole("button", { name: "Publish dashboard" })
  ).toBeInTheDocument();
});
