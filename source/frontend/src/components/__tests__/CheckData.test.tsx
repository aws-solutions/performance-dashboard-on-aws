import React from "react";
import { render } from "@testing-library/react";
import CheckData from "../CheckData";

test("renders the CheckData component", async () => {
  const wrapper = render(
    <CheckData
      data={[
        {
          id: "1",
          name: "Banana",
          updatedAt: "2021-11-11",
        },
        {
          id: "2",
          name: "Chocolate",
          updatedAt: "2020-11-11",
        },
        {
          id: "3",
          name: "Vanilla",
          updatedAt: "2019-11-11",
        },
      ]}
      advanceStep={() => {}}
      backStep={() => {}}
      onCancel={() => {}}
      setHiddenColumns={() => {}}
      hiddenColumns={new Set<string>()}
      dataTypes={new Map()}
      setDataTypes={() => {}}
      currencyTypes={new Map()}
      numberTypes={new Map()}
      setCurrencyTypes={() => {}}
      setNumberTypes={() => {}}
      widgetType="the chart"
    />
  );
  expect(wrapper.container).toMatchSnapshot();
});
