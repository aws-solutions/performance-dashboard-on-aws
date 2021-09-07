import ChartDataFormatter from "../ChartDataFormatter";

const parts = ["drink", "cup count"];
const exclude = ["espresso"];
const sampleData = [
  { drink: "coffee", "cup count": 2 },
  { drink: "tea", "cup count": 1 },
  { drink: "espresso", "cup count": 4 },
];
describe("donutChart", () => {
  it("return default ChartData on undefined data", () => {
    let result = ChartDataFormatter.donutChart(parts, exclude, undefined);

    expect(result.total).toEqual(0);
    expect(result.maxValue).toEqual(-Infinity);
    expect(result.values.length).toEqual(0);
  });

  it("return default ChartData on null data", () => {
    let result = ChartDataFormatter.donutChart(
      parts,
      exclude,
      null as unknown as Array<object>
    );

    expect(result.total).toEqual(0);
    expect(result.maxValue).toEqual(-Infinity);
    expect(result.values.length).toEqual(0);
  });

  it("return default ChartData on empty data", () => {
    let result = ChartDataFormatter.donutChart(parts, exclude, []);

    expect(result.total).toEqual(0);
    expect(result.maxValue).toEqual(-Infinity);
    expect(result.values.length).toEqual(0);
  });

  it("return appropriate total from data ", () => {
    let result = ChartDataFormatter.donutChart(parts, exclude, sampleData);

    expect(result.total).toEqual(3);
  });

  it("return appropriate max value from data ", () => {
    let result = ChartDataFormatter.donutChart(parts, exclude, sampleData);

    expect(result.maxValue).toEqual(2);
  });

  it("return appropriate values from data ", () => {
    let result = ChartDataFormatter.donutChart(parts, exclude, sampleData);

    expect(result.values.length).toEqual(2);
    expect(result.values[0].key).toEqual("coffee");
    expect(result.values[0].value).toEqual(2);
    expect(result.values[0].columnName).toEqual("cup count");
    expect(result.values[1].key).toEqual("tea");
    expect(result.values[1].value).toEqual(1);
    expect(result.values[1].columnName).toEqual("cup count");
  });

  it("handles exclude being null", () => {
    let result = ChartDataFormatter.donutChart(
      parts,
      null as unknown as Array<string>,
      sampleData
    );

    expect(result.values.length).toEqual(3);
  });
});
describe("pieChart", () => {
  it("return default ChartData on undefined data", () => {
    let result = ChartDataFormatter.pieChart(parts, exclude, undefined);

    expect(result.total).toEqual(0);
    expect(result.maxValue).toEqual(-Infinity);
    expect(result.values.length).toEqual(0);
  });

  it("return default ChartData on null data", () => {
    let result = ChartDataFormatter.pieChart(
      parts,
      exclude,
      null as unknown as Array<object>
    );

    expect(result.total).toEqual(0);
    expect(result.maxValue).toEqual(-Infinity);
    expect(result.values.length).toEqual(0);
  });

  it("return default ChartData on empty data", () => {
    let result = ChartDataFormatter.pieChart(parts, exclude, []);

    expect(result.total).toEqual(0);
    expect(result.maxValue).toEqual(-Infinity);
    expect(result.values.length).toEqual(0);
  });

  it("return appropriate total from data ", () => {
    let result = ChartDataFormatter.pieChart(parts, exclude, sampleData);

    expect(result.total).toEqual(3);
  });

  it("return appropriate max value from data ", () => {
    let result = ChartDataFormatter.pieChart(parts, exclude, sampleData);

    expect(result.maxValue).toEqual(2);
  });

  it("return appropriate values from data ", () => {
    let result = ChartDataFormatter.pieChart(parts, exclude, sampleData);

    expect(result.values.length).toEqual(2);
    expect(result.values[0].key).toEqual("coffee");
    expect(result.values[0].value).toEqual(2);
    expect(result.values[0].columnName).toEqual("cup count");
    expect(result.values[1].key).toEqual("tea");
    expect(result.values[1].value).toEqual(1);
    expect(result.values[1].columnName).toEqual("cup count");
  });

  it("handles exclude being null", () => {
    let result = ChartDataFormatter.pieChart(
      parts,
      null as unknown as Array<string>,
      sampleData
    );

    expect(result.values.length).toEqual(3);
  });
});
