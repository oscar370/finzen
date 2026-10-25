import { getLocale } from "@/paraglide/runtime";
import type { Option } from "@/types/i18n/option";

export function getMonths(
  locale = getLocale(),
  month: "long" | "short" = "long"
): Option[] {
  const formatter = new Intl.DateTimeFormat(locale, {
    month,
    timeZone: "UTC",
  });

  return Array.from({ length: 12 }, (_, i) => ({
    label: formatter.format(new Date(Date.UTC(2000, i, 1))),
    value: String(i + 1),
  }));
}
