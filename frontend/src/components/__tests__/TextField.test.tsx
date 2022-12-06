/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import TextField from "../TextField";

test("renders a text input", async () => {
    const wrapper = render(<TextField id="x" name="x" label="Hello" />);
    expect(wrapper.container).toMatchSnapshot();
});

test("renders a text input with hint", async () => {
    const wrapper = render(<TextField id="x" name="x" label="Hello" hint="Additional text" />);
    expect(wrapper.container).toMatchSnapshot();
});

test("registers the input to the provided function", async () => {
    const register = jest.fn();
    render(<TextField id="x" name="x" label="Hello" register={register} />);
    expect(register).toBeCalled();
});

test("registers the input as required", async () => {
    const register = jest.fn();
    render(<TextField id="x" name="x" label="Hello" register={register} required />);
    expect(register).toBeCalledWith({ required: true });
});

test("sets the default value", async () => {
    const { getByRole } = render(<TextField id="x" name="x" label="Hello" defaultValue="Banana" />);
    expect(getByRole("textbox")).toHaveValue("Banana");
});

test("check onChange event is invoked", async () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
        <TextField id="x" name="x" label="Hello" defaultValue="Banana" onChange={onChange} />,
    );

    fireEvent.input(getByLabelText("Hello"), {
        target: {
            value: "Test",
        },
    });

    await waitFor(() => expect(onChange).toHaveBeenCalled());
});

test("shows an error message", async () => {
    const wrapper = render(
        <TextField
            id="x"
            name="x"
            label="Hello"
            error="Something went wrong"
            hint="Also displays hint"
        />,
    );
    expect(wrapper.container).toMatchSnapshot();
});

test("renders a multiline textarea", async () => {
    const wrapper = render(<TextField id="x" name="x" label="Hello" multiline rows={10} />);
    expect(wrapper.container).toMatchSnapshot();
});
