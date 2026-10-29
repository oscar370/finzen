import { db } from "@/lib/dexie/db";
import { TransactionNotFoundError } from "@/lib/errors/transaction-not-found-error";
import { scheduleBackupSync } from "../backup/schedule-sync";
import { syncMonthlySummary } from "../monthly-summary/sync-monthly-summary";
import { updateBalance } from "../settings/update-balance";

export async function deleteTransaction(id: number) {
  await db.transaction(
    "rw!",
    [db.transactions, db.app_state, db.monthly_summaries],
    async () => {
      const transaction = await db.transactions.get(id);

      if (!transaction) throw new TransactionNotFoundError();

      if (transaction.isDeleted) return;

      await db.transactions.update(id, { isDeleted: 1 });
      await updateBalance(transaction, "remove");
      await syncMonthlySummary(transaction, "remove");
    }
  );

  scheduleBackupSync();
}
