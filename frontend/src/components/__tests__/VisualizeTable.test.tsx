/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import VisualizeTable from "../VisualizeTable";
import { MemoryRouter } from "react-router-dom";
import { DatasetType } from "../../models";
import Button from "../Button";

test("renders the VisualizeTable component", async () => {
    const wrapper = render(
        <VisualizeTable
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
            processingWidget={false}
            fullPreview={false}
            fullPreviewButton={<Button>Full preview</Button>}
            submitButtonLabel="Add Table"
            summaryBelow={false}
            setSortByColumn={() => {}}
            setSortByDesc={() => {}}
            columnsMetadata={[]}
            headers={["1", "2", "3"]}
            originalJson={[
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
            showTitle={true}
            significantDigitLabels={false}
            displayWithPages={true}
            summary={""}
            title={"Test"}
            configHeader={<></>}
        />,
        { wrapper: MemoryRouter },
    );
    expect(wrapper.container).toMatchSnapshot();
});
