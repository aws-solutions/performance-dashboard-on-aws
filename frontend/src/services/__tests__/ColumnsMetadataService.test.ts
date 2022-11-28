import { ColumnDataType, CurrencyDataType, NumberDataType } from "../../models";
import ColumnsMetadataService from "../ColumnsMetadataService";

describe("ColumnsMetadataService", () => {
  const sampleColumnMetadata: any = {
    hiddenColumns: new Set(["id"]),
    dataTypes: new Map<string, ColumnDataType>([
      ["id", ColumnDataType.Text],
      ["name", ColumnDataType.Text],
      ["quantity", ColumnDataType.Number],
      ["price", ColumnDataType.Number],
      ["updatedAt", ColumnDataType.Date],
    ]),
    numberTypes: new Map<string, NumberDataType>([
      ["quantity", NumberDataType.Percentage],
      ["price", NumberDataType.Currency],
    ]),
    currencyTypes: new Map<string, CurrencyDataType>([
      ["price", CurrencyDataType["Dollar $"]],
    ]),
  };

  test("should return columns metadata", () => {
    const { hiddenColumns, dataTypes, numberTypes, currencyTypes } =
      sampleColumnMetadata;
    const metadataResults = ColumnsMetadataService.getColumnsMetadata(
      hiddenColumns,
      dataTypes,
      numberTypes,
      currencyTypes
    );
    expect(
      metadataResults.filter((columnMetadata) => columnMetadata.hidden)
    ).toHaveLength(1);
    expect(
      metadataResults.filter(
        (columnMetadata) => columnMetadata.dataType === ColumnDataType.Text
      )
    ).toHaveLength(2);
    expect(
      metadataResults.filter(
        (columnMetadata) => columnMetadata.dataType === ColumnDataType.Date
      )
    ).toHaveLength(1);
    expect(
      metadataResults.filter(
        (columnMetadata) => columnMetadata.dataType === ColumnDataType.Number
      )
    ).toHaveLength(2);
    expect(
      metadataResults.filter(
        (columnMetadata) =>
          columnMetadata.numberType === NumberDataType.Percentage
      )
    ).toHaveLength(1);
    expect(
      metadataResults.filter(
        (columnMetadata) =>
          columnMetadata.numberType === NumberDataType.Currency
      )
    ).toHaveLength(1);
    expect(
      metadataResults.filter(
        (columnMetadata) =>
          columnMetadata.currencyType === CurrencyDataType["Dollar $"]
      )
    ).toHaveLength(1);
  });

  test("should parse the columns metadata", () => {
    const { hiddenColumns, dataTypes, numberTypes, currencyTypes } =
      sampleColumnMetadata;
    const columnsMetadata = ColumnsMetadataService.getColumnsMetadata(
      hiddenColumns,
      dataTypes,
      numberTypes,
      currencyTypes
    );
    const parsedColumnsMetadata =
      ColumnsMetadataService.parseColumnsMetadata(columnsMetadata);

    expect(parsedColumnsMetadata.hiddenColumns.size).toBe(1);
    expect(parsedColumnsMetadata.dataTypes.size).toBe(5);
    expect(parsedColumnsMetadata.numberTypes.size).toBe(2);
    expect(parsedColumnsMetadata.currencyTypes.size).toBe(1);
  });

  test("should format the number to USD", () => {
    const formattedNumber = ColumnsMetadataService.formatNumber(
      100,
      NumberDataType.Currency,
      CurrencyDataType["Dollar $"]
    );
    expect(formattedNumber).toBe("$100.00");
  });

  test("should format the number to EUR", () => {
    const formattedNumber = ColumnsMetadataService.formatNumber(
      100,
      NumberDataType.Currency,
      CurrencyDataType["Euro €"]
    );
    expect(formattedNumber).toBe("€100.00");
  });

  test("should format the number to GBP", () => {
    const formattedNumber = ColumnsMetadataService.formatNumber(
      100,
      NumberDataType.Currency,
      CurrencyDataType["Pound £"]
    );
    expect(formattedNumber).toBe("£100.00");
  });

  test("should format the number to percentage", () => {
    const formattedNumber = ColumnsMetadataService.formatNumber(
      100,
      NumberDataType.Percentage,
      undefined
    );
    expect(formattedNumber).toBe("100%");
  });

  test("should format the number with thousands separators", () => {
    const formattedNumber = ColumnsMetadataService.formatNumber(
      1000,
      NumberDataType["With thousands separators"],
      undefined
    );
    expect(formattedNumber).toBe("1,000");
  });
});
