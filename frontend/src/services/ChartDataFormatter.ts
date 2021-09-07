import { isString } from "util";

export class DataKvp {
  value: number;
  key: string;

  constructor(value: number, key: string) {
    this.value = value;
    this.key = key;
  }
}

export class ChartData {
  total: number;
  values: Array<DataKvp>;
  maxValue: number;
  constructor() {
    this.total = 0;
    this.values = [];
    this.maxValue = -Infinity;
  }
}

function portionChart(
  parts: Array<string>,
  exlcudeValues: Array<string>,
  data?: Array<object>
) {
  const chartData = new ChartData();

  if (data === undefined || data === null || !Array.isArray(data))
    return chartData;

  if (
    parts.length < 2 ||
    typeof parts[0] !== "string" ||
    typeof parts[1] !== "string"
  )
    return chartData;

  exlcudeValues =
    exlcudeValues === undefined || exlcudeValues === null ? [] : exlcudeValues;

  const nameSelector = parts[0];
  const valueSelector = parts[1];

  for (
    let i = 0, dataLength = data.length, item = null;
    i < dataLength && (item = data[i]);
    i++
  ) {
    const columnName = item[nameSelector as keyof object];
    const value = item[valueSelector as keyof object];
    const valueKey = `${columnName}`;

    if (exlcudeValues.includes(valueKey)) {
      continue;
    }

    const valueNum = isNaN(value) ? 0 : Number(value);

    chartData.total += valueNum;
    chartData.values.push(new DataKvp(valueNum, valueKey));
    chartData.maxValue = Math.max(chartData.maxValue, valueNum);
  }

  return chartData;
}
function pieChart(
  parts: Array<string>,
  exlcudeValues: Array<string>,
  data?: Array<object>
) {
  return portionChart(parts, exlcudeValues, data);
}
function donutChart(
  parts: Array<string>,
  exlcudeValues: Array<string>,
  data?: Array<object>
) {
  return portionChart(parts, exlcudeValues, data);
}
const ChartDataFormatter = {
  pieChart,
  donutChart,
};

export default ChartDataFormatter;
