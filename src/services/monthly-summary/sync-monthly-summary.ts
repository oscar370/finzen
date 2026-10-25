import { db } from "@/lib/dexie/db";
import { parseYearMonth } from "@/lib/utils/parse-year-month";
import { toYearMonth } from "@/lib/utils/to-year-month";
import type { Transaction } from "@/types/transactions/transaction";
import type { TransactionDraft } from "@/types/transactions/transaction-draft";
import {
  applyTransactionToSummary,
  createMonthlySummary,
} from "./summary-calculator";

export async function syncMonthlySummary(
  transaction: Transaction | TransactionDraft,
  mode: "add" | "remove"
) {
  const yearMonth = toYearMonth(transaction.date);
  const parts = parseYearMonth(yearMonth);

  if (!parts) return;

  const current = await db.monthly_summaries.get(yearMonth);
  const summary = applyTransactionToSummary(
    current ?? createMonthlySummary(yearMonth),
    transaction,
    mode
  );

  await db.monthly_summaries.put(summary);
}
