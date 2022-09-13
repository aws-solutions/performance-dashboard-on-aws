import React from "react";
import { render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { LocationState } from "../../models";
import AlertContainer from "../AlertContainer";

test("displays an alert when location.state contains an alert", () => {
  const history = createMemoryHistory<LocationState>();
  history.push("/whatever", {
    alert: {
      type: "success",
      message: "Hello this is an alert",
    },
  });

  const { getByText } = render(
    <Router history={history}>
      <AlertContainer />
    </Router>
  );

  expect(getByText("Hello this is an alert")).toBeInTheDocument();
});

test("displays nothing when no alert in location.state", () => {
  const history = createMemoryHistory<LocationState>();
  history.push("/whatever", {});

  const wrapper = render(
    <Router history={history}>
      <AlertContainer />
    </Router>
  );

  expect(wrapper.container).toMatchSnapshot();
});
