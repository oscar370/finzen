import { TitleBar } from "@/components/ui/title-bar";
import { AddTransaction } from "@/features/transactions";
import { t } from "i18next";
import { motion } from "motion/react";

export function NewTransactions() {
  return (
    <>
      <motion.div
        initial={{ translateX: 300, opacity: 0 }}
        animate={{ translateX: 0, opacity: 1 }}
        exit={{ translateX: 300, opacity: 0 }}
        transition={{ type: "tween", duration: 0.2 }}
      >
        <TitleBar
          title={t("titles.newTransaction", { ns: "transactions" })}
          isSubPage
        />

        <main className="mx-auto max-w-150 space-y-3 px-1 py-3">
          <AddTransaction />
        </main>
      </motion.div>
    </>
  );
}
