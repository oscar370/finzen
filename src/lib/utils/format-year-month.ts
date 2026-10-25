export function formatYearMonth(year: number, month: number): string {
  const monthString = (month + 1).toString().padStart(2, "0");
  return `${year}-${monthString}`;
}
