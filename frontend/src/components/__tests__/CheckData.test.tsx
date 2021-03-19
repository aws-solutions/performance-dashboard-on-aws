import React from "react";
import { render } from "@testing-library/react";
import CheckData from "../CheckData";

test("renders a file input element", async () => {
  const wrapper = render(
    <CheckData
      data={[]}
      advanceStep={() => {}}
      backStep={() => {}}
      onCancel={() => {}}
      setSelectedHeaders={() => {}}
      setHiddenColumns={() => {}}
      selectedHeaders={new Set<string>()}
      hiddenColumns={new Set<string>()}
      register={() => {}}
    />
  );
  expect(wrapper.container).toMatchSnapshot();
});
