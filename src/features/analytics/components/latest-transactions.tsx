import { useTransactions } from "@/api/transactions";
import { ListBox } from "@/components/ui/list-box";
import { TransactionItems } from "@/features/transactions";
import { useTranslation } from "react-i18next";

export function LatestTransactions() {
  const { t } = useTranslation("analytics");
  const transactions = useTransactions();

  return (
    <ListBox title={t("titles.lastTransactions")}>
      <TransactionItems transactions={transactions} />
    </ListBox>
  );
}
