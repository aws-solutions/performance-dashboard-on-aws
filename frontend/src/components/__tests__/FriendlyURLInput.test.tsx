import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FriendlyURLInput from "../FriendlyURLInput";

const onChange = jest.fn();

beforeEach(() => {
  render(
    <FriendlyURLInput value="foo-bar" onChange={onChange} showWarning={false} />
  );
});

test("renders the preview of the URL", async () => {
  const hostname = window.location.hostname;
  expect(screen.getByText(`https://${hostname}/foo-bar`)).toBeInTheDocument();
});

test("edit link opens a modal to modify the URL", async () => {
  const editLink = screen.getByRole("button", { name: "Edit URL" });
  fireEvent.click(editLink);

  const textInput = screen.getByLabelText("Dashboard URL");
  await waitFor(() => expect(textInput).toBeInTheDocument());

  fireEvent.input(textInput, {
    target: {
      value: "fizzbuzz",
    },
  });

  fireEvent.click(screen.getByRole("button", { name: "Save" }));
  const hostname = window.location.hostname;
  await waitFor(() => screen.getByText(`https://${hostname}/fizzbuzz`));
});
