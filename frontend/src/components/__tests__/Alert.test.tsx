/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import Alert from "../Alert";

test("renders a info alert", async () => {
    const wrapper = render(<Alert type="info" message="Hello world" />);
    expect(wrapper.container).toMatchSnapshot();
});

test("renders a warning alert", async () => {
    const wrapper = render(<Alert type="warning" message="Hello world" />);
    expect(wrapper.container).toMatchSnapshot();
});

test("renders an error alert", async () => {
    const wrapper = render(<Alert type="error" message="Hello world" />);
    expect(wrapper.container).toMatchSnapshot();
});

test("renders a success alert", async () => {
    const wrapper = render(<Alert type="success" message="Hello world" />);
    expect(wrapper.container).toMatchSnapshot();
});

test("renders an alert with title", async () => {
    const wrapper = render(
        <Alert type="success" message="Hello world" title="Informative status" />,
    );
    expect(wrapper.container).toMatchSnapshot();
});

test("renders a slim alert", async () => {
    const wrapper = render(<Alert type="success" message="Hello world" slim />);
    expect(wrapper.container).toMatchSnapshot();
});

test("renders a slim alert ignoring title", async () => {
    const wrapper = render(
        <Alert type="success" message="Hello world" slim title="This should be ignored" />,
    );
    expect(wrapper.container).toMatchSnapshot();
});

test("renders an alert without icon", async () => {
    const wrapper = render(<Alert type="success" message="Hello world" hideIcon slim />);
    expect(wrapper.container).toMatchSnapshot();
});

test("renders an alert with HTML content as message", async () => {
    const wrapper = render(
        <Alert type="success" message={<a href="/">This is a link</a>} hideIcon slim />,
    );
    expect(wrapper.container).toMatchSnapshot();
});
