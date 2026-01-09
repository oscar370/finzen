import { useTransactionsById } from "@/api/transactions";
import { TitleBar } from "@/components/ui/title-bar";
import { TransactionView } from "@/features/transactions";
import { motion } from "motion/react";
import { useParams } from "react-router-dom";

export function Transaction() {
  const { id } = useParams();
  const transaction = useTransactionsById(id!);

  if (transaction)
    return (
      <>
        <motion.div
          initial={{ translateX: 300, opacity: 0 }}
          animate={{ translateX: 0, opacity: 1 }}
          exit={{ translateX: 300, opacity: 0 }}
          transition={{ type: "tween", duration: 0.2 }}
        >
          <TitleBar title={transaction.name} isSubPage />

          <TransactionView transaction={transaction} />
        </motion.div>
      </>
    );
}
