import { useArchivedTransactions } from "@/api/transactions";
import { ListBox } from "@/components/ui/list-box";
import { NavigationPage } from "@/components/ui/navigation-page";
import { TransactionItems } from "@/features/transactions";
import { useTranslation } from "react-i18next";

export default function ArchivedTransactions() {
  const { t } = useTranslation("transactions");
  const transactions = useArchivedTransactions(0, 20);

  if (transactions)
    return (
      <NavigationPage title={t("titles.archived")} isSubPage>
        {transactions.length === 0 ? (
          <p className="mt-4 text-center"> {t("messages.empty")} </p>
        ) : (
          <ListBox>
            <TransactionItems transactions={transactions} />
          </ListBox>
        )}
      </NavigationPage>
    );
}
