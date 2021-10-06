import React from "react";
import { render } from "@testing-library/react";
import DateRangePicker from "../DateRangePicker";
import dayjs from "dayjs";

const setStartDate = jest.fn();
const setEndDate = jest.fn();

function rangePicker(startDate?: Date, endDate?: Date) {
  return (
    <DateRangePicker
      start={{
        id: "startDate",
        name: "startDate",
        label: "Select a start date",
        date: startDate,
        setDate: setStartDate,
        dateFormat: "yyyy-MM-dd",
      }}
      end={{
        id: "endDate",
        name: "endDate",

        label: "Select an end date",
        date: endDate,
        setDate: setEndDate,
        dateFormat: "yyyy-MM-dd",
      }}
    />
  );
}

test("renders a date range input element", async () => {
  const wrapper = render(rangePicker());
  expect(wrapper.container).toMatchSnapshot();
});

test("when startDate is set input should reflect the value", async () => {
  const startDate = new Date();
  const wrapper = render(rangePicker(startDate));

  const startDateInput = wrapper.getAllByLabelText("Select a start date");

  expect(startDateInput[0].getAttribute("value")).toBe(
    dayjs(startDate).format("YYYY-MM-DD")
  );
});

test("when endDate is set input should reflect the value", async () => {
  const endDate = new Date();
  const wrapper = render(rangePicker(null, endDate));

  const endDateInput = wrapper.getAllByLabelText("Select an end date");

  expect(endDateInput[0].getAttribute("value")).toBe(
    dayjs(endDate).format("YYYY-MM-DD")
  );
});
