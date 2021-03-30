import { ColumnMetadata, ColumnDataType, NumberDataType } from "../models";
import ColumnsMetadataService from "./ColumnsMetadataService";

const ONE_THOUSAND = 1000;
const ONE_MILLION = 1000000;
const ONE_BILLION = 1000000000;

const THOUSANDS_LABEL = "K";
const MILLIONS_LABEL = "M";
const BILLIONS_LABEL = "B";

function format(
  tick: any,
  largestTick: number,
  significantDigitLabels: boolean,
  columnMetadata?: ColumnMetadata
): string {
  const dataType =
    columnMetadata && columnMetadata.dataType
      ? getDataTypeFromMetadata(columnMetadata)
      : typeof tick;

  switch (dataType) {
    case "string":
      return formatString(tick);
    case "number":
      return formatNumber(
        tick,
        largestTick,
        significantDigitLabels,
        columnMetadata
      );
    default:
      return tick;
  }
}

function getDataTypeFromMetadata(
  columnMetadata: ColumnMetadata
): "string" | "number" {
  if (columnMetadata.dataType === ColumnDataType.Number) {
    return "number";
  }

  if (columnMetadata.dataType === ColumnDataType.Text) {
    return "string";
  }

  return "string";
}

function formatString(tick: string) {
  return String(tick).toLocaleString();
}

function formatNumber(
  num: number,
  largestTick: number,
  significantDigitLabels: boolean,
  columnMetadata?: ColumnMetadata
): string {
  if (isNaN(num)) {
    return "";
  }

  if (
    columnMetadata &&
    (columnMetadata.numberType === NumberDataType.Currency ||
      columnMetadata.numberType === NumberDataType.Percentage)
  ) {
    return ColumnsMetadataService.formatNumber(
      num,
      columnMetadata.numberType,
      columnMetadata.currencyType
    );
  }

  if (!significantDigitLabels || num === 0) {
    return num.toLocaleString();
  }

  if (Math.abs(largestTick) >= ONE_BILLION) {
    const value = num / ONE_BILLION;
    return value.toLocaleString() + BILLIONS_LABEL;
  }

  if (Math.abs(largestTick) >= ONE_MILLION) {
    const value = num / ONE_MILLION;
    return value.toLocaleString() + MILLIONS_LABEL;
  }

  if (Math.abs(largestTick) >= ONE_THOUSAND) {
    const value = num / ONE_THOUSAND;
    return value.toLocaleString() + THOUSANDS_LABEL;
  }

  return num.toLocaleString();
}

const TickFormatter = {
  format,
};

export default TickFormatter;
