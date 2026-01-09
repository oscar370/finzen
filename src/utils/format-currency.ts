export function formatCurrency(currency: string, value: number) {
  const userLocale = navigator.language;
  const formatter = new Intl.NumberFormat(userLocale, {
    style: "currency",
    currency: currency,
  });

  return formatter.format(value);
}
