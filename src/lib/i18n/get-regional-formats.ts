import type { Option } from "@/types/i18n/option";
import { CURRENCY_REGIONS } from "../constants/currency-regions";
import { toSortedOptions } from "./to-sorted-options";

const REGIONAL_TAGS = [...new Set(Object.values(CURRENCY_REGIONS))];

export function getRegionalFormats(): Option[] {
  return toSortedOptions(REGIONAL_TAGS, "language");
}
