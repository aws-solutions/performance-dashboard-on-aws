import React from "react";
import { render } from "@testing-library/react";
import RadioButtons from "../RadioButtons";

test("renders radio buttons", async () => {
  const wrapper = render(
    <RadioButtons
      id="historial-figures"
      name="historical-figures"
      label="Historical Figures"
      hint="Select a historical figure"
      options={[
        {
          label: "Harriet Tubman",
          value: "1",
        },
        {
          label: "Susan B. Anthony",
          value: "2",
        },
        {
          label: "Elizabeth Cady Stanton",
          value: "3",
        }
      ]}
    />
  );

  expect(wrapper.container).toMatchSnapshot();
});

test("selects a value by default", async () => {
  const { getByLabelText } = render(
    <RadioButtons
      id="historial-figures"
      name="historical-figures"
      label="Historical Figures"
      defaultValue="2"
      options={[
        {
          label: "Harriet Tubman",
          value: "1",
        },
        {
          label: "Susan B. Anthony",
          value: "2",
        },
      ]}
    />
  );

  expect(getByLabelText("Susan B. Anthony")).toHaveAttribute("checked");
  expect(getByLabelText("Harriet Tubman")).not.toHaveAttribute("checked");
});

test("calls register function", async () => {
  const register = jest.fn();
  render(
    <RadioButtons
      id="historial-figures"
      name="historical-figures"
      label="Historical Figures"
      register={register}
      options={[
        {
          label: "Harriet Tubman",
          value: "1",
        }
      ]}
    />
  );
  expect(register).toBeCalled();
});

test("renders an error", async () => {
  const wrapper = render(
    <RadioButtons
      id="historial-figures"
      name="historical-figures"
      label="Historical Figures"
      error="Something went wrong"
      options={[
        {
          label: "Harriet Tubman",
          value: "1",
        }
      ]}
    />
  );
  expect(wrapper.container).toMatchSnapshot();
});