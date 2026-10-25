import { currentYearMonth } from "./current-year-month";

export type MonthSearch = { yearMonth: string };

const YEAR_MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export function validateMonthSearch(
  search: Record<string, unknown>
): MonthSearch {
  return {
    yearMonth:
      typeof search.yearMonth === "string" &&
      YEAR_MONTH_PATTERN.test(search.yearMonth)
        ? search.yearMonth
        : currentYearMonth(),
  };
}
