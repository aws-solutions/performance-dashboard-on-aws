const ONE_THOUSAND = 1000;
const ONE_MILLION = 1000000;
const ONE_BILLION = 1000000000;

const THOUSANDS_LABEL = "K";
const MILLIONS_LABEL = "M";
const BILLIONS_LABEL = "B";

function formatNumber(
  num: number,
  largestTick: number,
  significantDigitLabels: boolean
): string {
  if (isNaN(num)) {
    return "";
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
  formatNumber,
};

export default TickFormatter;
