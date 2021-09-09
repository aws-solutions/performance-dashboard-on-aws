import { ColumnDataType, CurrencyDataType, NumberDataType } from "../../models";
import TickFormatter from "../TickFormatter";

describe("format handles ticks of type string", () => {
  it("returns the value in locale string", () => {
    const largestTick = 500;
    const tick = "2020/04/11";
    expect(TickFormatter.format(tick, largestTick, true, "", "")).toEqual(
      "2020/04/11"
    );
  });
});

describe("formatNumber with significantDigitLabels enabled", () => {
  it("does not add significant digit label when largestTick is < 1000", () => {
    const largestTick = 500;
    expect(TickFormatter.format(100, largestTick, true, "", "")).toEqual("100");
    expect(TickFormatter.format(0.5, largestTick, true, "", "")).toEqual("0.5");
  });

  it("adds K when largestTick is greater than 1K", () => {
    const largestTick = 1500;
    expect(TickFormatter.format(100, largestTick, true, "", "")).toEqual(
      "0.1K"
    );
    expect(TickFormatter.format(1800, largestTick, true, "", "")).toEqual(
      "1.8K"
    );
    expect(TickFormatter.format(2000, largestTick, true, "", "")).toEqual("2K");
    expect(TickFormatter.format(999999, largestTick, true, "", "")).toEqual(
      "999.999K"
    );
  });

  it("adds M when largestTick is greater than 1M", () => {
    const largestTick = 1500000;
    expect(TickFormatter.format(1500000, largestTick, true, "", "")).toEqual(
      "1.5M"
    );
  });

  it("adds B when largestTick is greater than 1B", () => {
    const largestTick = 1000000000;
    expect(TickFormatter.format(1000000000, largestTick, true, "", "")).toEqual(
      "1B"
    );
  });

  it("handles negative values by taking the absolute value", () => {
    const largestTick = -1500;
    expect(TickFormatter.format(1000, largestTick, true, "", "")).toEqual("1K");
    expect(TickFormatter.format(-1000, largestTick, true, "", "")).toEqual(
      "-1K"
    );
  });

  it("does not add label when value is zero", () => {
    const largestTick = 1000;
    expect(TickFormatter.format(0, largestTick, true, "", "")).toEqual("0");
  });
});

describe("formatNumber with significantDigitLabels disabled", () => {
  it("returns number in locale string", () => {
    const largestTick = 25000;
    expect(TickFormatter.format(25000, largestTick, false, "", "")).toEqual(
      "25,000"
    );
  });
});

describe("format when columnMetadata is provided", () => {
  it("returns a string when dataType is Text", () => {
    const largestTick = 1000;
    expect(
      TickFormatter.format(2018, largestTick, true, "", "", {
        columnName: "Year",
        hidden: false,
        dataType: ColumnDataType.Text,
      })
    ).toEqual("2018");
  });

  it("returns a number when dataType is Number", () => {
    const largestTick = 1000;
    const significantDigitLabels = true;

    expect(
      TickFormatter.format(2018, largestTick, significantDigitLabels, "", "", {
        columnName: "Year",
        hidden: false,
        dataType: ColumnDataType.Number,
      })
    ).toEqual("2.018K");
  });
});

describe("format when columnMetadata is Currency", () => {
  it("appends currency symbol", () => {
    const largestTick = 100000;
    const significantDigitLabels = false;

    expect(
      TickFormatter.format(
        100000,
        largestTick,
        significantDigitLabels,
        "",
        "",
        {
          columnName: "Revenue",
          hidden: false,
          dataType: ColumnDataType.Number,
          numberType: NumberDataType.Currency,
          currencyType: CurrencyDataType["Euro €"],
        }
      )
    ).toEqual("€100,000");
  });

  it("appends currency symbol and ignores significant digit label", () => {
    const largestTick = 100000;
    const significantDigitLabels = true;

    expect(
      TickFormatter.format(
        100000,
        largestTick,
        significantDigitLabels,
        "",
        "",
        {
          columnName: "Revenue",
          hidden: false,
          dataType: ColumnDataType.Number,
          numberType: NumberDataType.Currency,
          currencyType: CurrencyDataType["Euro €"],
        }
      )
    ).toEqual("€100K");
  });
});

describe("format when columnMetadata is Percentage", () => {
  it("appends percentage symbol", () => {
    const largestTick = 100000;
    const significantDigitLabels = false;

    expect(
      TickFormatter.format(
        100000,
        largestTick,
        significantDigitLabels,
        "",
        "",
        {
          columnName: "Revenue",
          hidden: false,
          dataType: ColumnDataType.Number,
          numberType: NumberDataType.Percentage,
        }
      )
    ).toEqual("100,000%");
  });

  it("appends currency symbol and ignores significant digit label", () => {
    const largestTick = 100000;
    const significantDigitLabels = true;

    expect(
      TickFormatter.format(
        100000,
        largestTick,
        significantDigitLabels,
        "",
        "",
        {
          columnName: "Revenue",
          hidden: false,
          dataType: ColumnDataType.Number,
          numberType: NumberDataType.Percentage,
        }
      )
    ).toEqual("100K%");
  });
});
