import { locales } from "@/paraglide/runtime";
import type { Option } from "@/types/i18n/option";
import { capitalize } from "../utils/capitalize";

export function getLanguageEndonyms(): Option[] {
  return locales.map((code) => ({
    label: capitalize(
      new Intl.DisplayNames(code, { type: "language" }).of(code) ?? code,
      code
    ),
    value: code,
  }));
}
