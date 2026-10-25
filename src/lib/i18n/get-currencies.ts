import type { Option } from "@/types/i18n/option";
import { CURRENCY_REGIONS } from "../constants/currency-regions";
import { toSortedOptions } from "./to-sorted-options";

const CURRENCIES = Object.keys(CURRENCY_REGIONS);

export function getCurrencies(): Option[] {
  return toSortedOptions(CURRENCIES, "currency");
}
