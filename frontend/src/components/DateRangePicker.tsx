/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

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
      setMinEndDate(nextDate);
    } else {
      setMinEndDate(null);
    }
  }, [props.start.date]);

  useEffect(() => {
    if (props.end.date) {
      let prevDate = new Date(props.end.date);
      setMaxStartDate(prevDate);
    } else {
      setMaxStartDate(null);
    }
  }, [props.end.date]);

  return (
    <div className="usa-date-range-picker">
      <DatePicker
        data-testid="startDate"
        maxDate={maxStartDate}
        {...props.start}
      />
      <DatePicker data-testid="endDate" minDate={minEndDate} {...props.end} />
    </div>
  );
}

export default DateRangePicker;
