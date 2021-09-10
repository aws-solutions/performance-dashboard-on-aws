import { ChartType } from "../models";

/**
 * Create a header row json. The first row of data will be interpreted as
 * field names. Each row of data will be an object of values keyed by field.
 */
function createHeaderRowJson(data: Array<any>): Array<any> {
  const csvJson = new Array<any>();
  if (data.length) {
    const headers = data[0] as Array<any>;
    for (let i = 1; i < data.length; i++) {
      let row: any = {};
      const entry = data[i] as Array<any>;
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        const value = entry[j];
        row = {
          ...row,
          [typeof header === "number" ? `"${header}"` : header]: value,
        };
      }
      csvJson.push(row);
    }
  }
  return csvJson;
}

function getFilteredJson(
  json: Array<any>,
  hiddenColumns: Set<string>
): Array<any> {
  let headers = json.length ? (Object.keys(json[0]) as Array<string>) : [];
  headers = headers.filter((h) => !hiddenColumns.has(h));
  const newFilteredJson = [];
  for (const row of json) {
    const filteredRow = headers.reduce((obj, key) => {
      return {...obj, [key]: row[key as keyof typeof row]};
    }, {});
    if (Object.keys(filteredRow).length) {
      newFilteredJson.push(filteredRow);
    }
  }
  return newFilteredJson;
}

function getDatasetSortOptions(
  json: Array<any>,
  headers: Array<string>,
  t: Function,
  chartType?: ChartType
): any {
  const sortOptions: any = [{ value: "", label: t("SelectAnOption") }];

  headers.forEach((h, index) => {
    if (
      !chartType ||
      index <= 1 ||
      chartType === ChartType.LineChart ||
      chartType === ChartType.BarChart ||
      chartType === ChartType.ColumnChart
    ) {
      const column = [];
      for (const row of json) {
        column.push(row[h]);
      }
      const isNumberOrDate =
        column.every((c) => typeof c === "number") ||
        column.every((c) => !isNaN(Date.parse(c)));
      const sortTypeAsc = isNumberOrDate ? t("LowToHigh") : t("AZ");
      const sortTypeDesc = isNumberOrDate ? t("HighToLow") : t("Z-A");
      sortOptions.push({ value: `${h}###asc`, label: `"${h}" ${sortTypeAsc}` });
      sortOptions.push({
        value: `${h}###desc`,
        label: `"${h}" ${sortTypeDesc}`,
      });
    }
  });

  return sortOptions;
}

function sortFilteredJson(
  filteredJson: Array<any>,
  sortByColumn: string | undefined,
  sortByDesc: boolean | undefined
): void {
  if (sortByColumn !== undefined && sortByDesc !== undefined) {
    filteredJson.sort((row1: any, row2: any) => {
      if (
        row1[sortByColumn || ""] !== undefined &&
        row2[sortByColumn || ""] !== undefined
      ) {
        return row1[sortByColumn || ""] < row2[sortByColumn || ""]
          ? sortByDesc
            ? 1
            : -1
          : sortByDesc
          ? -1
          : 1;
      } else {
        return 0;
      }
    });
  }
}

const DatasetParsingService = {
  createHeaderRowJson,
  getFilteredJson,
  getDatasetSortOptions,
  sortFilteredJson,
};

export default DatasetParsingService;
