/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import Page from "../Page";

jest.mock("../../hooks");
jest.mock("../../services/BackendService");

describe("Page", () => {
  const history = createMemoryHistory();

  test("renders a page", async () => {
    const { baseElement } = render(
      <Router history={history}>
        <Page title="this is a title" />
      </Router>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("should set document title", async () => {
    render(
      <Router history={history}>
        <Page title="this is a title" />
      </Router>
    );
    expect(document.title).toBe("this is a title - Performance Dashboard");
  });
});
