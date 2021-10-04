import React, { useEffect, useState } from "react";
import DatePicker, { Props as DatePickerProps } from "./DatePicker";

interface Props {
  start: DatePickerProps;
  end: DatePickerProps;
}

function DateRangePicker(props: Props) {
  const [maxStartDate, setMaxStartDate] = useState<Date | null>(null);
  const [minEndDate, setMinEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (props.start.date) {
      let nextDate = new Date(props.start.date);
      nextDate.setDate(props.start.date.getDate() + 1);
      setMinEndDate(nextDate);
    } else {
      setMinEndDate(null);
    }
  }, [props.start.date]);

  useEffect(() => {
    if (props.end.date) {
      let prevDate = new Date(props.end.date);
      prevDate.setDate(props.end.date.getDate() - 1);
      setMaxStartDate(prevDate);
    } else {
      setMaxStartDate(null);
    }
  }, [props.end.date]);

  return (
    <>
      <DatePicker
        data-testid="startDate"
        maxDate={maxStartDate}
        {...props.start}
      />
      <DatePicker data-testid="endDate" minDate={minEndDate} {...props.end} />
    </>
  );
}

export default DateRangePicker;
