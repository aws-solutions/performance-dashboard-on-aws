import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { MemoryRouter, Router } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faGripLinesVertical,
  faCaretUp,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";

import DashboardPreview from "../DashboardPreview";

library.add(faGripLinesVertical, faCaretUp, faCaretDown);

jest.mock("../../hooks");

test("renders the name of the dashboard", async () => {
  const { findByText } = render(<DashboardPreview />, {
    wrapper: MemoryRouter,
  });
  const name = await findByText("My AWS Dashboard");
  expect(name).toBeInTheDocument();
});

test("renders the topic area as subtitle", async () => {
  const { findByText } = render(<DashboardPreview />, {
    wrapper: MemoryRouter,
  });
  const subtitle = await findByText("Bananas");
  expect(subtitle).toBeInTheDocument();
});

test("close preview button takes you to edit dashboard screen", async () => {
  const history = createMemoryHistory();
  jest.spyOn(history, "push");

  const { findByRole } = render(
    <Router history={history}>
      <DashboardPreview />
    </Router>
  );

  const closePreview = await findByRole("button", { name: "Close Preview" });
  fireEvent.click(closePreview);
  expect(history.push).toHaveBeenCalledWith("/admin/dashboard/edit/123");
});
