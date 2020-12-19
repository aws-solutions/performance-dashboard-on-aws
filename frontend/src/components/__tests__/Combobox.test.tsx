import React from "react";
import { render } from "@testing-library/react";
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
