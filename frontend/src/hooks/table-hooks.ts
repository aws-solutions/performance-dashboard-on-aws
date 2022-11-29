/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";

type UseTableMetadata = {
  largestTickByColumn: LargestTicksByColumn;
};

type LargestTicksByColumn = {
  [columnName: string]: number;
};

export function useTableMetadata(data?: object[]): UseTableMetadata {
  const [largestTickByColumn, setLargestTickByColumn] =
    useState<LargestTicksByColumn>({});

  React.useEffect(() => {
    if (data) {
      const largestByColumn: LargestTicksByColumn = {};
      data.forEach((row: any) => {
        Object.keys(row).forEach((columnName) => {
          if (typeof row[columnName] === "number") {
            const value = row[columnName];
            if (!largestByColumn[columnName]) {
              largestByColumn[columnName] = -Infinity;
            }

            largestByColumn[columnName] = Math.max(
              largestByColumn[columnName],
              value
            );
          }
        });
      });
      setLargestTickByColumn(largestByColumn);
    }
  }, [data]);

  return {
    largestTickByColumn,
  };
}
