/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import { Route, Router, MemoryRouter } from "react-router-dom";
import { createMemoryHistory } from "history";
import withSAMLAuthenticator from "../SAMLAuthenticator";
import withPublicLayout from "../Public";
import Home from "../../containers/Home";

const history = createMemoryHistory();

describe("SAMLAuthenticatorLayout", () => {
    test("renders the component", async () => {
        const wrapper = render(
            <Router history={history}>
                <Route component={withSAMLAuthenticator(withPublicLayout(Home))} />
            </Router>,
            { wrapper: MemoryRouter },
        );
        expect(wrapper.container).toMatchSnapshot();
    });
});
