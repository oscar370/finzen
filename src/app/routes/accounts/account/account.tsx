import { useAccountById } from "@/api/accounts";
import { useTransactionsByAccount } from "@/api/transactions";
import { ListBox } from "@/components/ui/list-box";
import { NavigationPage } from "@/components/ui/navigation-page";
import { AccountDetails } from "@/features/accounts";
import { TransactionItems } from "@/features/transactions";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export function Account() {
  const { id } = useParams();
  const account = useAccountById(id!);
  const transactions = useTransactionsByAccount(id!, 0, 20);
  const { t } = useTranslation(["accounts", "transactions"]);

  if (account)
    return (
      <NavigationPage title={account.name} isSubPage>
        <AccountDetails account={account} />

        <ListBox title={t("list.title", { ns: "transactions" })}>
          <TransactionItems transactions={transactions} />
        </ListBox>
      </NavigationPage>
    );
}
