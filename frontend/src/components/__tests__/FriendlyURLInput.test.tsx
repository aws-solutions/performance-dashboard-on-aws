import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FriendlyURLInput from "../FriendlyURLInput";

let friendlyUrl: string = "foo-bar";
const newFriendlyUrl: string = "fizzbuzz";

beforeEach(() => {
  render(
    <FriendlyURLInput
      value={friendlyUrl}
      onChange={() => {
        friendlyUrl = newFriendlyUrl;
      }}
      showWarning={false}
    />
  );
});

test("renders the preview of the URL", async () => {
  const hostname = window.location.hostname;
  expect(
    screen.getByText(`https://${hostname}/${friendlyUrl}`)
  ).toBeInTheDocument();
});

test("edit link opens a modal to modify the URL", async () => {
  const editLink = screen.getByRole("button", { name: "Edit URL" });
  fireEvent.click(editLink);

  const textInput = screen.getByLabelText("Dashboard URL");
  await waitFor(() => expect(textInput).toBeInTheDocument());

  fireEvent.input(textInput, {
    target: {
      value: newFriendlyUrl,
    },
  });

  fireEvent.click(screen.getByRole("button", { name: "Save" }));
  await waitFor(() => expect(friendlyUrl).toEqual(newFriendlyUrl));
});
