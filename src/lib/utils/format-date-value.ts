export function formatDateValue(input: Date | undefined): string {
  if (!input || Number.isNaN(input.getTime())) return "";

  const year = input.getFullYear();
  const month = String(input.getMonth() + 1).padStart(2, "0");
  const day = String(input.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
