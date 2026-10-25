import { toYearMonth } from "./to-year-month";

export function currentYearMonth() {
  return toYearMonth(new Date());
}
