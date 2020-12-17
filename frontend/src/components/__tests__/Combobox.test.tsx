import React from "react";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Combobox from "../Combobox";

test("renders a combobox", async () => {
  const wrapper = render(
    <Combobox
      id="1"
      label="label"
      name="name"
      options={[
        { value: "value1", content: "content1" },
        { value: "value2", content: "content2" },
      ]}
      onChange={jest.fn()}
    />
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("shows an error message", async () => {
  const wrapper = render(
    <Combobox
      id="1"
      label="label"
      name="name"
      error="Something went wrong"
      options={[
        { value: "value1", content: "content1" },
        { value: "value2", content: "content2" },
      ]}
      onChange={jest.fn()}
    />
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("check onChange event is invoked", async () => {
  const onChange = jest.fn();
  const { getByLabelText, getAllByText } = render(
    <Combobox
      id="1"
      label="label"
      name="name"
      error="Something went wrong"
      options={[
        { value: "value1", content: "content1" },
        { value: "value2", content: "content2" },
      ]}
      onChange={onChange}
    />
  );

  userEvent.click(getByLabelText("label"));

  userEvent.click(getAllByText("content2")[1]);

  await waitFor(() => expect(onChange).toHaveBeenCalled());
});
