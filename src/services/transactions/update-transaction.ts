import { db } from "@/lib/dexie/db";
import { CategoryNotFoundError } from "@/lib/errors/category-not-found-error";
import { TransactionNotFoundError } from "@/lib/errors/transaction-not-found-error";
import { toYearMonth } from "@/lib/utils/to-year-month";
import {
  vTransactionDraft,
  type TransactionDraft,
} from "@/types/transactions/transaction-draft";
import type { Transaction } from "@/types/transactions/transaction";
import { parse } from "valibot";
import { syncMonthlySummary } from "../monthly-summary/sync-monthly-summary";
import { updateBalance } from "../settings/update-balance";

export async function updateTransaction(
  id: number,
  updates: TransactionDraft
): Promise<Transaction> {
  const transaction = parse(vTransactionDraft, updates);

  return db.transaction(
    "rw!",
    [db.transactions, db.categories, db.monthly_summaries, db.app_state],
    async () => {
      const oldTransaction = await db.transactions.get(id);

      if (!oldTransaction) throw new TransactionNotFoundError();

      const category = await db.categories.get(transaction.categoryId);

      if (!category || category.isDeleted) throw new CategoryNotFoundError();

      const newTransaction: Transaction = {
        ...transaction,
        id,
        categoryIcon: category.icon,
        categoryName: category.name,
        yearMonth: toYearMonth(transaction.date),
        isDeleted: 0,
      };

      await db.transactions.put(newTransaction);
      await updateBalance(oldTransaction, "remove");
      await syncMonthlySummary(oldTransaction, "remove");
      await updateBalance(newTransaction, "add");
      await syncMonthlySummary(newTransaction, "add");

      return newTransaction;
    }
  );
}
