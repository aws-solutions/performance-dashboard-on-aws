import {
  ColumnMetadata,
  ColumnDataType,
  NumberDataType,
  CurrencyDataType,
} from "../models";

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
  percentage: string,
  currency: string,
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
        columnMetadata,
        percentage,
        currency
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

  if (columnMetadata && columnMetadata.numberType === NumberDataType.Currency) {
    currency = columnMetadata.currencyType;
  }

  if (
    columnMetadata &&
    columnMetadata.numberType === NumberDataType.Percentage
  ) {
    percentage = NumberDataType.Percentage;
  }

  let formattedNum = formatSignificantDigits(
    num,
    largestTick,
    significantDigitLabels
  );

  if (!percentage && !currency) {
    if (formattedNum !== num.toLocaleString()) {
      return formattedNum;
    } else {
      return num.toLocaleString();
    }
  }

  if (percentage === NumberDataType.Percentage) {
    return formattedNum + `%`;
  }

  if (currency) {
    if (currency === CurrencyDataType["Dollar $"] || currency === "$") {
      return `$` + formattedNum;
    } else if (currency === CurrencyDataType["Euro €"] || currency === "€") {
      return `€` + formattedNum;
    } else if (currency === CurrencyDataType["Pound £"] || currency === "£") {
      return `£` + formattedNum;
    }
  }

  return num.toLocaleString();
}

function formatSignificantDigits(
  num: number,
  largestTick: number,
  significantDigitLabels: boolean
): string {
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

  return formattedNum;
}

function stackedFormat(tick: any,
  largestTick: number,
  significantDigitLabels: boolean,
  labels: string[],
  labelsMetadata: ColumnMetadata[]
) {
  const sum = labels
    .map((column) => tick[column])
    .reduce((a, b) => a + b, 0);
  const allPercentage = labels
    .every((c: string) =>
      labelsMetadata.some(
        (cm: any) =>
          cm.columnName === c &&
          cm.numberType === NumberDataType.Percentage
      )
    );
  const allCurrencyDollar = labels
    .every((c: string) =>
      labelsMetadata.some(
        (cm: any) =>
          cm.columnName === c &&
          cm.numberType === NumberDataType.Currency &&
          cm.currencyType !== undefined &&
          cm.currencyType ===
            CurrencyDataType["Dollar $"]
      )
    );
  const allCurrencyEuro = labels
    .every((c: string) =>
      labelsMetadata.some(
        (cm: any) =>
          cm.columnName === c &&
          cm.numberType === NumberDataType.Currency &&
          cm.currencyType !== undefined &&
          cm.currencyType ===
            CurrencyDataType["Euro €"]
      )
    );
  const allCurrencyPound = labels
    .every((c: string) =>
      labelsMetadata.some(
        (cm: any) =>
          cm.columnName === c &&
          cm.numberType === NumberDataType.Currency &&
          cm.currencyType !== undefined &&
          cm.currencyType ===
            CurrencyDataType["Pound £"]
      )
    );
  return format(
    sum,
    largestTick,
    significantDigitLabels,
    allPercentage ? NumberDataType.Percentage : "",
    allCurrencyDollar
      ? CurrencyDataType["Dollar $"]
      : allCurrencyEuro
      ? CurrencyDataType["Euro €"]
      : allCurrencyPound
      ? CurrencyDataType["Pound £"]
      : ""
  );
}

const TickFormatter = {
  format,
  formatNumber,
  stackedFormat: stackedFormat
};

export default TickFormatter;
