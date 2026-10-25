import { getLocale } from "@/paraglide/runtime";
import type { Option } from "@/types/i18n/option";
import { capitalize } from "../utils/capitalize";

export function toSortedOptions(
  codes: string[],
  type: "currency" | "language",
  locale = getLocale()
): Option[] {
  const names = new Intl.DisplayNames(locale, { type });
  const collator = new Intl.Collator(locale);

  return codes
    .map((code) => ({
      label: capitalize(names.of(code) ?? code, locale),
      value: code,
    }))
    .sort((a, b) => collator.compare(a.label, b.label));
}
