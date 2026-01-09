import { DescriptionRow } from "@/components/ui/description-row";
import { useAppStore } from "@/stores/use-app-store";
import { formatCurrency } from "@/utils/format-currency";
import { t } from "i18next";

type OverviewStatsProps = {
  balance: number;
  incomes: number;
  expenses: number;
  saving: number;
};

export function OverviewStats({
  balance,
  incomes,
  expenses,
  saving,
}: OverviewStatsProps) {
  const currency = useAppStore((state) => state.currency);

  return (
    <>
      <DescriptionRow label={t("fields.balance", { ns: "analytics" })}>
        {formatCurrency(currency, balance)}
      </DescriptionRow>

      <DescriptionRow label={t("fields.incomes", { ns: "analytics" })}>
        {formatCurrency(currency, incomes)}
      </DescriptionRow>

      <DescriptionRow label={t("fields.expenses", { ns: "analytics" })}>
        {formatCurrency(currency, expenses)}
      </DescriptionRow>

      <DescriptionRow label={t("fields.saving", { ns: "analytics" })}>
        {formatCurrency(currency, saving)}
      </DescriptionRow>
    </>
  );
}
