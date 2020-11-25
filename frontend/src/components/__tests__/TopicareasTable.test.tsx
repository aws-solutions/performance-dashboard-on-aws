import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TopicArea } from "../../models";
import TopicareasTable from "../TopicareasTable";

const topicArea: TopicArea = {
  id: "abc",
  name: "USWDS",
  createdBy: "johndoe",
};

test("renders an empty table", async () => {
  const wrapper = render(<TopicareasTable topicAreas={[]} />);
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a table with topic areas", async () => {
  const topicAreas = [topicArea];
  const wrapper = render(<TopicareasTable topicAreas={topicAreas} />, {
    wrapper: MemoryRouter,
  });
  expect(wrapper.container).toMatchSnapshot();
});

test("onSelect function is called when user selects topicarea", async () => {
  const onSelect = jest.fn();
  const { getByLabelText } = render(
    <TopicareasTable topicAreas={[topicArea]} onSelect={onSelect} />,
    {
      wrapper: MemoryRouter,
    }
  );

  await act(async () => {
    const checkbox = getByLabelText("USWDS");
    fireEvent.click(checkbox);
  });

  expect(onSelect).toBeCalledWith(expect.arrayContaining([topicArea]));
});
