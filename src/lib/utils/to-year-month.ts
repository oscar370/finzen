import { formatYearMonth } from "./format-year-month";

export function toYearMonth(date: Date): string {
  return formatYearMonth(date.getFullYear(), date.getMonth());
}
