import React from "react";
import { render } from "@testing-library/react";
import ChooseData from "../ChooseData";
import { DatasetType, SourceType } from "../../models";
import { MemoryRouter } from "react-router-dom";

test("renders the ChooseData component", async () => {
  const wrapper = render(
    <ChooseData
      selectDynamicDataset={() => {}}
      dynamicDatasets={[
        {
          id: "123",
          fileName: "abc",
          s3Key: {
            raw: "",
            json: "abc.json",
          },
          sourceType: SourceType.IngestApi,
          updatedAt: new Date("2020-12-09T17:21:42.823Z"),
        },
      ]}
      datasetType={DatasetType.DynamicDataset}
      onFileProcessed={() => {}}
      handleChange={() => {}}
      advanceStep={() => {}}
      fileLoading={false}
      browseDatasets={() => {}}
      continueButtonDisabled={false}
      csvErrors={[]}
      csvFile={undefined}
      onCancel={() => {}}
      register={() => {}}
      widgetType="chart"
    />,
    { wrapper: MemoryRouter }
  );
  expect(wrapper.container).toMatchSnapshot();
});
