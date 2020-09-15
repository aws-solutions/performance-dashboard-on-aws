import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { Widget } from "../../models";
import WidgetList from "../WidgetList";

test("renders an empty box", async () => {
  const onClick = jest.fn();
  const wrapper = render(<WidgetList widgets={[]} onClick={onClick} />);
  expect(wrapper.container).toMatchSnapshot();
});

test("calls the onClick callback when button is pressed", async () => {
  const onClick = jest.fn();
  const wrapper = render(<WidgetList widgets={[]} onClick={onClick} />);
  fireEvent.click(wrapper.getByRole("button"));
  expect(onClick).toBeCalled();
});

test("calls onDelete when user clicks delete button", async () => {
  const onDelete = jest.fn();
  const onClick = jest.fn();
  const widgets: Array<Widget> = [
    {
      id: "123",
      name: "The benefits of bananas",
      widgetType: "Text",
    },
  ];

  const wrapper = render(
    <WidgetList widgets={widgets} onClick={onClick} onDelete={onDelete} />
  );

  await act(async () => {
    fireEvent.click(wrapper.getByRole("button", { name: "Delete" }));
  });

  expect(onDelete).toBeCalled();
});
