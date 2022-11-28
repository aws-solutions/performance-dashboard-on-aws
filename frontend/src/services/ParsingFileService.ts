/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { parse, ParseResult } from "papaparse";
import { ExcelRenderer } from "react-excel-renderer";

function parseFile(data: File, header: boolean, onParse: Function): void {
  if (isExcelFile(data.type)) {
    ExcelRenderer(data, (errors: any, results: any) => {
      onParse(errors, results.rows);
    });
  } else {
    parse(data, {
      header,
      dynamicTyping: true,
      skipEmptyLines: true,
      comments: "#",
      encoding: "ISO-8859-1",
      complete: function (results: ParseResult<object>) {
        onParse(results.errors, results.data);
      },
    });
  }
}

function isExcelFile(type: string): boolean {
  return (
    type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
}

const ParsingFileService = {
  parseFile,
  isExcelFile,
};

export default ParsingFileService;
