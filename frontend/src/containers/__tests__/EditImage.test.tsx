import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BackendService from "../../services/BackendService";
import StorageService from "../../services/StorageService";
import EditImage from "../EditImage";

jest.mock("../../services/BackendService");
jest.mock("../../services/StorageService");
jest.mock("../../hooks");

beforeEach(() => {
  BackendService.editWidget = jest.fn();
  StorageService.downloadFile = jest.fn();
  window.URL.createObjectURL = jest.fn();
});

test("renders title", async () => {
  render(<EditImage />, { wrapper: MemoryRouter });
  expect(
    await screen.findByRole("heading", { name: "Edit Image" })
  ).toBeInTheDocument();
});

test("renders Image title", async () => {
  render(<EditImage />, { wrapper: MemoryRouter });
  expect(await screen.findByLabelText("Image title*")).toBeInTheDocument();
});

test("renders element descriptions", async () => {
  const { getByText } = render(<EditImage />, { wrapper: MemoryRouter });
  expect(getByText("Give your image a descriptive title.")).toBeInTheDocument();
  expect(getByText("Must be a PNG, JPEG, or SVG file")).toBeInTheDocument();
  expect(
    getByText(
      "Provide a short description of the image for users with visual impairments using a screen reader. This description will not display on the dashboard."
    )
  ).toBeInTheDocument();
  expect(
    getByText(
      "Give your image a description to explain it in more depth. It can also be read by screen readers to describe the image for those with visual impairments. This field supports markdown."
    )
  ).toBeInTheDocument();
});

test("renders a file upload input", async () => {
  render(<EditImage />, { wrapper: MemoryRouter });
  expect(await screen.findByLabelText("File upload")).toBeInTheDocument();
});

test("on submit, it calls editWidget api and uploads dataset", async () => {
  const { getByRole, getByText, getByLabelText } = render(<EditImage />, {
    wrapper: MemoryRouter,
  });

  const submitButton = getByRole("button", { name: "Save" });

  fireEvent.input(getByLabelText("Image title*"), {
    target: {
      value: "Test Image",
    },
  });

  fireEvent.input(getByLabelText("Image alt text*"), {
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
    expect(getByLabelText("Image alt text*")).toBeInTheDocument();
    expect(
      getByText(
        "Provide a short description of the image for users with visual impairments using a screen reader. This description will not display on the dashboard."
      )
    ).toBeInTheDocument();

    expect(getByText("Image description (optional)")).toBeInTheDocument();
    expect(
      getByText(
        "Give your image a description to explain it in more depth. It can also be read by screen readers to describe the image for those with visual impairments. This field supports markdown."
      )
    ).toBeInTheDocument();
  });

  await act(async () => {
    fireEvent.click(submitButton);
  });

  expect(BackendService.editWidget).toHaveBeenCalled();
  expect(StorageService.uploadImage).toHaveBeenCalled();
});

test("renders the expand preview button", async () => {
  render(<EditImage />, { wrapper: MemoryRouter });
  expect(
    screen.getByRole("button", { name: "Expand preview" })
  ).toBeInTheDocument();
});
