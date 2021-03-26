import { ColumnDataType } from "../models";

function getColumnsMetadata(
  hiddenColumns: Set<string>,
  dataTypes: Map<string, ColumnDataType>
): Array<any> {
  const columnsMetadata = Array.from(hiddenColumns).map((header) => {
    return {
      columnName: header,
      hidden: true,
      dataType: dataTypes.has(header) ? dataTypes.get(header) : undefined,
    };
  });

  dataTypes.forEach((dataType, columnName) => {
    if (!hiddenColumns.has(columnName)) {
      columnsMetadata.push({
        columnName,
        hidden: false,
        dataType,
      });
    }
  });

  return columnsMetadata;
}

type ColumnMetadata = {
  hiddenColumns: Set<string>;
  dataTypes: Map<string, ColumnDataType>;
};

function parseColumnsMetadata(columnsMetadata: Array<any>): ColumnMetadata {
  const hiddenColumns = new Set<string>();
  columnsMetadata
    .filter((column: any) => column.hidden)
    .forEach((column: any) => hiddenColumns.add(column.columnName));

  const dataTypes = new Map<string, ColumnDataType>();
  columnsMetadata
    .filter((column: any) => !!column.dataType)
    .forEach((column: any) =>
      dataTypes.set(column.columnName, column.dataType)
    );

  return { hiddenColumns, dataTypes };
}

const ColumnsMetadataService = {
  getColumnsMetadata,
  parseColumnsMetadata,
};

export default ColumnsMetadataService;
