import React from "react";
import { render } from "@testing-library/react";
import CheckData from "../CheckData";

test("renders the Check Data component", async () => {
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
      setSelectedHeaders={() => {}}
      setHiddenColumns={() => {}}
      selectedHeaders={new Set<string>()}
      hiddenColumns={new Set<string>()}
      register={() => {}}
      setSortByColumn={() => {}}
      setSortByDesc={() => {}}
    />
  );
  expect(wrapper.container).toMatchSnapshot();
});
