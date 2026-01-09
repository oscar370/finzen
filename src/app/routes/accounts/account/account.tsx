import { useAccountById } from "@/api/accounts";
import { useTransactionsByAccount } from "@/api/transactions";
import { Group } from "@/components/ui/group";
import { TitleBar } from "@/components/ui/title-bar";
import { AccountDetails } from "@/features/accounts";
import { TransactionsList } from "@/features/transactions";
import { t } from "i18next";
import { motion } from "motion/react";
import { useParams } from "react-router-dom";

export function Account() {
  const { id } = useParams();
  const account = useAccountById(id!);
  const transactions = useTransactionsByAccount(id!, 0, 20);

  if (account)
    return (
      <motion.div
        initial={{ translateX: 300, opacity: 0 }}
        animate={{ translateX: 0, opacity: 1 }}
        exit={{ translateX: 300, opacity: 0 }}
        transition={{ type: "tween", duration: 0.2 }}
      >
        <TitleBar title={account.name} isSubPage />

        <main className="mx-auto max-w-150 space-y-3 px-1 py-3">
          <AccountDetails data={account} />

          <Group title={t("list.title", { ns: "transactions" })}>
            <TransactionsList data={transactions} />
          </Group>
        </main>
      </motion.div>
    );
}
