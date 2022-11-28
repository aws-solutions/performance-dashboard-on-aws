/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import DatasetParsingService from "../DatasetParsingService";

describe("createHeaderRowJson", () => {
  test("returns empty array given empty data", () => {
    expect(DatasetParsingService.createHeaderRowJson([])).toEqual([]);
  });

  test("returns an array of header rows", () => {
    const data = [
      ["Header1", "Header2"],
      ["Data1", "Data2"],
    ];

    const headerRowJson = [{ Header1: "Data1", Header2: "Data2" }];

    const headerRow = DatasetParsingService.createHeaderRowJson(data);
    expect(headerRow).toEqual(headerRowJson);
  });
});
