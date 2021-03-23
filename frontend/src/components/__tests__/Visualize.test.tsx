import React from "react";
import { render } from "@testing-library/react";
import Visualize from "../Visualize";
import { MemoryRouter } from "react-router-dom";
import { DatasetType } from "../../models";

test("renders the Check Data component", async () => {
  const wrapper = render(
    <Visualize
      errors={[]}
      register={() => {}}
      json={[
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
      csvJson={[]}
      datasetLoading={false}
      datasetType={DatasetType.DynamicDataset}
      onCancel={() => {}}
      backStep={() => {}}
      advanceStep={() => {}}
      fileLoading={false}
      creatingWidget={false}
    />,
    { wrapper: MemoryRouter }
  );
  expect(wrapper.container).toMatchSnapshot();
});
