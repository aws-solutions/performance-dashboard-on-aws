import React from "react";
import { render } from "@testing-library/react";
import TextField from "../TextField";

test("renders a text input", async () => {
  const wrapper = render(<TextField id="x" name="x" label="Hello" />);
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a text input with hint", async () => {
  const wrapper = render(
    <TextField id="x" name="x" label="Hello" hint="Additional text" />
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("registers the input to the provided function", async () => {
  const register = jest.fn();
  render(<TextField id="x" name="x" label="Hello" register={register} />);
  expect(register).toBeCalled();
});

test("registers the input as required", async () => {
  const register = jest.fn();
  render(
    <TextField id="x" name="x" label="Hello" register={register} required />
  );
  expect(register).toBeCalledWith({ required: true });
});

test("sets the default value", async () => {
  const { getByRole } = render(
    <TextField id="x" name="x" label="Hello" defaultValue="Banana" />
  );
  expect(getByRole("textbox")).toHaveValue("Banana");
});

test("shows an error message", async () => {
  const wrapper = render(
    <TextField
      id="x"
      name="x"
      label="Hello"
      error="Something went wrong"
      hint="Also displays hint"
    />
  );
  expect(wrapper.container).toMatchSnapshot();
});
