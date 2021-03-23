import React from "react";
import {
  render,
  fireEvent,
  act,
  waitFor,
  screen,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BackendService from "../../services/BackendService";
import StorageService from "../../services/StorageService";
import AddImage from "../AddImage";

jest.mock("../../services/BackendService");
jest.mock("../../services/StorageService");

beforeEach(() => {
  BackendService.createWidget = jest.fn();
  BackendService.createDataset = jest.fn().mockReturnValue({ id: "1244" });
  StorageService.uploadDataset = jest.fn().mockReturnValue("abc.jpg");
  window.URL.createObjectURL = jest.fn();
});

test("renders title and subtitles", async () => {
  render(<AddImage />, {
    wrapper: MemoryRouter,
  });
  expect(
    await screen.findByRole("heading", { name: "Add Image" })
  ).toBeInTheDocument();
  expect(await screen.findByText("Configure image")).toBeInTheDocument();
  expect(await screen.findByText("Step 2 of 2")).toBeInTheDocument();
});

test("renders a textfield for image title", async () => {
  render(<AddImage />, { wrapper: MemoryRouter });
  expect(await screen.findByLabelText("Image title")).toBeInTheDocument();
});

test("renders a file upload input", async () => {
  render(<AddImage />, { wrapper: MemoryRouter });
  expect(await screen.findByLabelText("File upload")).toBeInTheDocument();
});

test("on submit, it calls createWidget api and uploads dataset", async () => {
  const { getByRole, getByText, getByLabelText } = render(<AddImage />, {
    wrapper: MemoryRouter,
  });

  const submitButton = getByRole("button", { name: "Add image" });

  fireEvent.input(getByLabelText("Image title"), {
    target: {
      value: "Test Image",
    },
  });

  fireEvent.input(getByLabelText("Image alt text"), {
    target: {
      value: "Test alt text",
    },
  });

  fireEvent.change(getByLabelText("File upload"), {
    target: {
      files: ["image.jpg"],
    },
  });

  await waitFor(() => expect(submitButton).toBeEnabled());
  await waitFor(() => {
    expect(getByText("Preview")).toBeInTheDocument();

    expect(getByText("Image alt text")).toBeInTheDocument();
    expect(
      getByText(
        "Provide a short description of the image for users with visual impairments using a screen reader. This description will not display on the dashboard."
      )
    ).toBeInTheDocument();

    expect(getByText("Image description - optional")).toBeInTheDocument();
    expect(
      getByText(
        "Give your chart a summary to explain it in more depth. It can also be read by screen readers to describe the chart for those with visual impairments. This field supports markdown."
      )
    ).toBeInTheDocument();
  });

  await act(async () => {
    fireEvent.click(submitButton);
  });

  expect(BackendService.createWidget).toHaveBeenCalled();
  expect(StorageService.uploadImage).toHaveBeenCalled();
});

test("renders the expand preview button", async () => {
  render(<AddImage />, { wrapper: MemoryRouter });
  expect(
    screen.getByRole("button", { name: "Expand preview" })
  ).toBeInTheDocument();
});
