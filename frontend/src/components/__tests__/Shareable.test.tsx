import React from "react";
import { fireEvent, render } from "@testing-library/react";
import Shareable from "../Shareable";

test("renders the content", async () => {
  const { getByText } = render(
    <Shareable id="1" title="test">
      Awesome
    </Shareable>
  );
  expect(getByText("Awesome")).toBeInTheDocument();
});

test("renders the anchor button", async () => {
  const { getByLabelText } = render(
    <Shareable id="1" title="test">
      Awesome
    </Shareable>
  );

  const copyLink = getByLabelText("Copy link: test");

  expect(copyLink).toBeInTheDocument();
});
