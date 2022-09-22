import { useCallback } from "react";
import dayjs from "dayjs";
import { useSettings } from "./";
import { TFunction } from "i18next";

export function useDateTimeFormatter(): Function {
  const { settings } = useSettings();
  return useCallback(
    (dateToDisplay: Date) => {
      const { date, time } = settings.dateTimeFormat;
      return dayjs(dateToDisplay)
        .locale(window.navigator.language.toLowerCase())
        .format(`${date} ${time}`);
    },
    [settings]
  );
}

export function CalculateDuration(date: Date, t: TFunction): string {
  const timeDiffMs = new Date().getTime() - new Date(date).getTime();
  const timeDiffMin = timeDiffMs / 1000 / 60;

  if (timeDiffMin < 5) {
    return [t("Updated"), t("JustNow")].join(" ");
  } else if (timeDiffMin < 60) {
    return [
      t("Updated"),
      Math.floor(timeDiffMin),
      t("Minutes"),
      t("Ago"),
    ].join(" ");
  } else if (timeDiffMin < 60 * 24) {
    return [
      t("Updated"),
      Math.floor(timeDiffMin / 60),
      t("Hours"),
      t("Ago"),
    ].join(" ");
  } else if (timeDiffMin < 60 * 24 * 30) {
    return [
      t("Updated"),
      Math.floor(timeDiffMin / 60 / 24),
      t("Days"),
      t("Ago"),
    ].join(" ");
  } else if (timeDiffMin < 60 * 24 * 30 * 12) {
    return [
      t("Updated"),
      Math.floor(timeDiffMin / 60 / 24 / 30),
      t("Months"),
      t("Ago"),
    ].join(" ");
  } else if (timeDiffMin < 60 * 24 * 30 * 12 * 3) {
    return [
      t("Updated"),
      Math.floor(timeDiffMin / 60 / 24 / 30 / 12),
      t("Years"),
      t("Ago"),
    ].join(" ");
  } else {
    return [t("Updated"), t("OverThreeYears"), t("Ago")].join(" ");
  }
};
