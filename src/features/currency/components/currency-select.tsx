import { SelectRow } from "@/components/ui/select-row";
import { updateCurrency, useAppStore } from "@/stores/use-app-store";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function CurrencySelect() {
  const { t } = useTranslation("currency");
  const currency = useAppStore((state) => state.currency);

  const CURRENCIES = [
    { value: "USD", label: t("select.options.USD") },
    { value: "EUR", label: t("select.options.EUR") },
    { value: "JPY", label: t("select.options.JPY") },
    { value: "GBP", label: t("select.options.GBP") },
    { value: "AUD", label: t("select.options.AUD") },
    { value: "CAD", label: t("select.options.CAD") },
    { value: "CHF", label: t("select.options.CHF") },
    { value: "CNY", label: t("select.options.CNY") },
    { value: "MXN", label: t("select.options.MXN") },
    { value: "NZD", label: t("select.options.NZD") },
  ];

  function handleChange(value: string) {
    updateCurrency(value);
    toast.success(t("success.add", { ns: "currency" }));
  }

  return (
    <SelectRow
      title={t("select.label")}
      value={currency}
      onChange={handleChange}
      options={CURRENCIES}
    />
  );
}
