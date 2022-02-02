import React from "react";
import { fireEvent, render } from "@testing-library/react";
import Shareable from "../Shareable";
import { MemoryRouter } from "react-router-dom";

test("renders the content", async () => {
  const { getByText } = render(
    <MemoryRouter>
      <Shareable id="1" title="test">
        Awesome
      </Shareable>
    </MemoryRouter>
  );
  expect(getByText("Awesome")).toBeInTheDocument();
});

test("renders the anchor button", async () => {
  const { getByLabelText } = render(
    <MemoryRouter>
      <Shareable id="1" title="test">
        Awesome
      </Shareable>
    </MemoryRouter>
  );
  const copyLink = getByLabelText("Copy link: test");

  expect(copyLink).toBeInTheDocument();
});
