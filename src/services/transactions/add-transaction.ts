import { db } from "@/lib/dexie/db";
import { CategoryNotFoundError } from "@/lib/errors/category-not-found-error";
import { toYearMonth } from "@/lib/utils/to-year-month";
import {
  vTransactionDraft,
  type TransactionDraft,
} from "@/types/transactions/transaction-draft";
import { parse } from "valibot";
import { scheduleBackupSync } from "../backup/schedule-sync";
import { syncMonthlySummary } from "../monthly-summary/sync-monthly-summary";
import { updateBalance } from "../settings/update-balance";

export async function addTransaction(draftTransaction: TransactionDraft) {
  const transaction = parse(vTransactionDraft, draftTransaction);

  const transactionId = await db.transaction(
    "rw!",
    [db.transactions, db.categories, db.app_state, db.monthly_summaries],
    async () => {
      const category = await db.categories.get(transaction.categoryId);

      if (!category || category.isDeleted) throw new CategoryNotFoundError();

      const newTransaction = {
        ...transaction,
        categoryIcon: category.icon,
        categoryName: category.name,
        yearMonth: toYearMonth(transaction.date),
        isDeleted: 0 as const,
      };

      const id = await db.transactions.add(newTransaction);

      await updateBalance(newTransaction, "add");
      await syncMonthlySummary(newTransaction, "add");

      return id;
    }
  );

  scheduleBackupSync();

  return transactionId;
}
