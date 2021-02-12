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

const DatasetParsingService = {
  createHeaderRowJson,
};

export default DatasetParsingService;
