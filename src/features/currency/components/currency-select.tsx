import { Select } from "@/components/ui/select";
import { t } from "i18next";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

const CURRENCIES = [
  { code: "USD", label: "select.options.USD" },
  { code: "EUR", label: "select.options.EUR" },
  { code: "JPY", label: "select.options.JPY" },
  { code: "GBP", label: "select.options.GBP" },
  { code: "AUD", label: "select.options.AUD" },
  { code: "CAD", label: "select.options.CAD" },
  { code: "CHF", label: "select.options.CHF" },
  { code: "CNY", label: "select.options.CNY" },
  { code: "MXN", label: "select.options.MXN" },
  { code: "NZD", label: "select.options.NZD" },
];

type CurrencySelectProps<T extends FieldValues> = {
  name: Path<T>;
  register: UseFormRegister<T>;
};

export function CurrencySelect<T extends FieldValues>({
  name,
  register,
}: CurrencySelectProps<T>) {
  return (
    <Select
      label={t("select.label", { ns: "currency" })}
      name={name}
      register={register}
    >
      {CURRENCIES.map(({ label, code }) => (
        <option key={code} value={code}>
          {t(label, { ns: "currency" })}
        </option>
      ))}
    </Select>
  );
}
