import TickFormatter from "../TickFormatter";

describe("formatNumber with significantDigitLabels enabled", () => {
  it("does not add significant digit label when largestTick is < 1000", () => {
    const largestTick = 500;
    expect(TickFormatter.formatNumber(100, largestTick, true)).toEqual("100");
    expect(TickFormatter.formatNumber(0.5, largestTick, true)).toEqual("0.5");
  });

  it("adds K when largestTick is greater than 1K", () => {
    const largestTick = 1500;
    expect(TickFormatter.formatNumber(100, largestTick, true)).toEqual("0.1K");
    expect(TickFormatter.formatNumber(1800, largestTick, true)).toEqual("1.8K");
    expect(TickFormatter.formatNumber(2000, largestTick, true)).toEqual("2K");
    expect(TickFormatter.formatNumber(999999, largestTick, true)).toEqual(
      "999.999K"
    );
  });

  it("adds M when largestTick is greater than 1M", () => {
    const largestTick = 1500000;
    expect(TickFormatter.formatNumber(1500000, largestTick, true)).toEqual(
      "1.5M"
    );
  });

  it("adds B when largestTick is greater than 1B", () => {
    const largestTick = 1000000000;
    expect(TickFormatter.formatNumber(1000000000, largestTick, true)).toEqual(
      "1B"
    );
  });

  it("handles negative values by taking the absolute value", () => {
    const largestTick = -1500;
    expect(TickFormatter.formatNumber(1000, largestTick, true)).toEqual("1K");
    expect(TickFormatter.formatNumber(-1000, largestTick, true)).toEqual("-1K");
  });

  it("does not add label when value is zero", () => {
    const largestTick = 1000;
    expect(TickFormatter.formatNumber(0, largestTick, true)).toEqual("0");
  });
});

describe("formatNumber with significantDigitLabels disabled", () => {
  it("returns number in locale string", () => {
    const largestTick = 25000;
    expect(TickFormatter.formatNumber(25000, largestTick, false)).toEqual(
      "25,000"
    );
  });
});
