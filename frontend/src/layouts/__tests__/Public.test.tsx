/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import { Route, Router, MemoryRouter } from "react-router-dom";
import { createMemoryHistory } from "history";
import withPublicLayout from "../Public";
import Home from "../../containers/Home";

const history = createMemoryHistory();

describe("PublicLayout", () => {
  test("renders the component", async () => {
    const wrapper = render(
      <Router history={history}>
        <Route component={withPublicLayout(Home)} />
      </Router>,
      { wrapper: MemoryRouter }
    );
    expect(wrapper.container).toMatchSnapshot();
  });
});
