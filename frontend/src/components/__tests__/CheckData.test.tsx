/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import CheckData from "../CheckData";
import { ColumnDataType } from "../../models";

test("renders the CheckData component", async () => {
    const wrapper = render(
        <CheckData
            data={[
                {
                    id: "1",
                    name: "Banana",
                    updatedAt: "2021-11-11",
                    icon: "fa-banana",
                },
                {
                    id: "2",
                    name: "Chocolate",
                    updatedAt: "2020-11-11",
                    icon: "fa-candy-bar",
                },
                {
                    id: "3",
                    name: "Vanilla",
                    updatedAt: "2019-11-11",
                    icon: "fa-ice-cream",
                },
            ]}
            advanceStep={() => {}}
            backStep={() => {}}
            onCancel={() => {}}
            setHiddenColumns={() => {}}
            hiddenColumns={new Set<string>()}
            dataTypes={
                new Map<string, ColumnDataType>([
                    ["id", ColumnDataType.Number],
                    ["name", ColumnDataType.Text],
                    ["updatedAt", ColumnDataType.Date],
                ])
            }
            setDataTypes={() => {}}
            currencyTypes={new Map()}
            numberTypes={new Map()}
            setCurrencyTypes={() => {}}
            setNumberTypes={() => {}}
            widgetType="the chart"
        />,
    );
    expect(wrapper.container).toMatchSnapshot();
});
