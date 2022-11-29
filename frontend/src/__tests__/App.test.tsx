/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import "../services/EnvConfig";

jest.mock("../services/BackendService");
jest.mock("../hooks");

describe("App", () => {
  test("renders the component", async () => {
    (global as any).EnvironmentConfig = {
      authenticationRequired: false,
    };
    const wrapper = render(<App />, { wrapper: MemoryRouter });
    expect(wrapper.container).toMatchSnapshot();
  });
});
