import { useAccountById } from "@/api/accounts";
import { useCategoryById } from "@/api/categories";
import { DescriptionRow } from "@/components/ui/description-row";
import { useAppStore } from "@/stores/use-app-store";
import type { Transaction } from "@/types/transactions";
import { formatCurrency } from "@/utils/format-currency";
import dayjs from "dayjs";
import { t } from "i18next";

type TransactionDetailProps = {
  data: Transaction;
};

export function TransactionDetail({ data }: TransactionDetailProps) {
  const currency = useAppStore((state) => state.currency);
  const { name, kind, amount, accountId, categoryId, date, note } = data;
  const category = useCategoryById(categoryId);
  const account = useAccountById(accountId);

  return (
    <>
      <DescriptionRow label={t("fields.name", { ns: "transactions" })}>
        {name}
      </DescriptionRow>
      <DescriptionRow label={t("fields.kind", { ns: "transactions" })}>
        {t(`kind.${kind}`, { ns: "transactions" })}
      </DescriptionRow>
      <DescriptionRow label={t("fields.amount", { ns: "transactions" })}>
        {formatCurrency(currency, amount)}
      </DescriptionRow>
      <DescriptionRow label={t("fields.category", { ns: "transactions" })}>
        {t(`${category?.name}`, { ns: "categories" })}
      </DescriptionRow>
      <DescriptionRow label={t("fields.account", { ns: "transactions" })}>
        {account?.name}
      </DescriptionRow>
      <DescriptionRow label={t("fields.date", { ns: "transactions" })}>
        {dayjs(date).format("LLLL")}
      </DescriptionRow>
      <DescriptionRow label={t("fields.note", { ns: "transactions" })}>
        {note}
      </DescriptionRow>
    </>
  );
}
