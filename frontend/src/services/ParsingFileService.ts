/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { parse, ParseResult } from "papaparse";
import XLSX from "xlsx";

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
    return type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
}

function ExcelRenderer(file: File, callback: any) {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        reader.onload = function (e: any) {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });

            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];

            /* Convert array of arrays */
            const json = XLSX.utils.sheet_to_json(ws, { header: 1 });
            const cols = makeColumns(ws["!ref"]);

            const data = { rows: json, cols };

            resolve(data);
            return callback(null, data);
        };
        if (file && rABS) reader.readAsBinaryString(file);
        else reader.readAsArrayBuffer(file);
    });
}

function makeColumns(refstr: any) {
    let o = [];
    let C = XLSX.utils.decode_range(refstr).e.c + 1;
    for (let i = 0; i < C; ++i) {
        o[i] = { name: XLSX.utils.encode_col(i), key: i };
    }
    return o;
}

const ParsingFileService = {
    parseFile,
    isExcelFile,
};

export default ParsingFileService;
