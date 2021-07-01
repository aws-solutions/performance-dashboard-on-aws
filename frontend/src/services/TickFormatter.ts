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
  columnMetadata?: ColumnMetadata,
  percentage?: string,
  currency?: string
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

  let formattedNum = num.toLocaleString();

  if (!significantDigitLabels || num === 0) {
    formattedNum = num.toLocaleString();
  } else if (Math.abs(largestTick) >= ONE_BILLION) {
    const value = num / ONE_BILLION;
    formattedNum = value.toLocaleString() + BILLIONS_LABEL;
  } else if (Math.abs(largestTick) >= ONE_MILLION) {
    const value = num / ONE_MILLION;
    formattedNum = value.toLocaleString() + MILLIONS_LABEL;
  } else if (Math.abs(largestTick) >= ONE_THOUSAND) {
    const value = num / ONE_THOUSAND;
    formattedNum = value.toLocaleString() + THOUSANDS_LABEL;
  }

  if (!percentage && !currency) {
    if (formattedNum !== num.toLocaleString()) {
      return formattedNum;
    } else {
      return num.toLocaleString();
    }
  }

  if (percentage === "Percentage") {
    return formattedNum + `%`;
  }

  if (currency) {
    if (currency === "Dollar $") {
      return `$` + formattedNum;
    } else if (currency === "Euro €") {
      return `€` + formattedNum;
    } else if (currency === "Pound £") {
      return `£` + formattedNum;
    }
  }

  return num.toLocaleString();
}

const TickFormatter = {
  format,
  formatNumber,
};

export default TickFormatter;
