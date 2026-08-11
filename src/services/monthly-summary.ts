import { db } from "#/lib/db";
import type { DraftTransaction, Transaction } from "#/types/transactions";

export async function syncMonthlySummary(
  transaction: Transaction | DraftTransaction,
  mode: "add" | "remove",
) {
  const year = transaction.date.getFullYear();
  const month = transaction.date.getMonth() + 1;
  const id = `${year}-${month}`;

  const current = await db.monthly_summaries.get(id);

  const summary = current ?? {
    id,
    year,
    month,
    income: 0,
    expense: 0,
    adjustments: 0,
  };

  const factor = mode === "add" ? 1 : -1;
  const amountWithSign = transaction.amount * factor;

  if (transaction.kind === "income") {
    summary.income += amountWithSign;
  } else {
    summary.expense += amountWithSign;
  }

  summary.income = Number(summary.income.toFixed(2));
  summary.expense = Number(summary.expense.toFixed(2));
  summary.adjustments = Number((summary.income - summary.expense).toFixed(2));

  await db.monthly_summaries.put(summary);
}

export function getMonthlySummary(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const id = `${year}-${month}`;

  return db.monthly_summaries.get(id);
}
