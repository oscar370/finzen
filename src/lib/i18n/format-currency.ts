import { getLocale } from "@/paraglide/runtime";
import type { CURRENCY_REGIONS } from "../constants/currency-regions";

export type CurrencyCode = keyof typeof CURRENCY_REGIONS;

export function formatCurrency(
  amount: number,
  currency: CurrencyCode | (string & {}),
  locale: string = getLocale()
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch {
    return new Intl.NumberFormat(getLocale(), {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  }
}
