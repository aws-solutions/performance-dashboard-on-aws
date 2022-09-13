import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BackendService from "../../services/BackendService";
import StorageService from "../../services/StorageService";
import EditFavicon from "../EditFavicon";

jest.mock("../../services/BackendService");
jest.mock("../../services/StorageService");
jest.mock("../../hooks");

beforeEach(() => {
  BackendService.updateSetting = jest.fn();
  StorageService.downloadFavicon = jest.fn();
  window.URL.createObjectURL = jest.fn();
});

test("renders title", async () => {
  render(<EditFavicon />, { wrapper: MemoryRouter });
  expect(
    await screen.findByRole("heading", { name: "Edit favicon" })
  ).toBeInTheDocument();
});

test("renders page description", async () => {
  const { getByText } = render(<EditFavicon />, { wrapper: MemoryRouter });
  expect(
    getByText("This favicon will appear in the browser tab.")
  ).toBeInTheDocument();
});

test("renders a file upload input", async () => {
  render(<EditFavicon />, { wrapper: MemoryRouter });
  expect(await screen.findByLabelText("File upload*")).toBeInTheDocument();
});

test("renders file upload description constraint", async () => {
  const { getByText } = render(<EditFavicon />, { wrapper: MemoryRouter });
  expect(getByText("Must be a PNG, JPEG, or SVG file")).toBeInTheDocument();
});

test("on submit, it calls updateSetting and upload favicon", async () => {
  const { getByRole, getByLabelText } = render(<EditFavicon />, {
    wrapper: MemoryRouter,
  });

  const submitButton = getByRole("button", { name: "Save" });

  const file = new File(["dummy content"], "filename.png", {
    type: "image/png",
  });
  const uploadFile = getByLabelText("File upload*");
  Object.defineProperty(uploadFile, "files", { value: [file] });
  Object.defineProperty(uploadFile, "value", {
    value: file.name,
  });
  fireEvent.change(uploadFile);

  await act(async () => {
    fireEvent.click(submitButton);
  });

  expect(BackendService.updateSetting).toHaveBeenCalled();
  expect(StorageService.uploadFavicon).toHaveBeenCalled();
});
