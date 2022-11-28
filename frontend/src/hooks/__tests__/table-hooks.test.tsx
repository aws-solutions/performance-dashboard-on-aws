/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, act, screen } from "@testing-library/react";
import { useTableMetadata } from "../table-hooks";

describe("useTableMetadata", () => {
  interface Props {
    data?: object[];
  }
  const FooComponent = (props: Props) => {
    const { largestTickByColumn } = useTableMetadata(props.data);
    return (
      <>
        <span>{Object.keys(largestTickByColumn).length}</span>
      </>
    );
  };

  test("should fetch the topic area", async () => {
    const sampleData: object[] = [{ with: 50, height: 25 }];
    await act(async () => {
      render(<FooComponent data={sampleData} />);
    });

    expect(
      screen.getByText(Object.keys(sampleData[0]).length)
    ).toBeInTheDocument();
  });
});
