import { parse, ParseResult } from "papaparse";
import { ExcelRenderer } from "react-excel-renderer";

function parseFile(data: File, header: boolean, onParse: Function): void {
  if (
    data.type ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
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

const ParsingFileService = {
  parseFile,
};

export default ParsingFileService;
