import { db } from "@/lib/dexie";
import type { Transaction } from "@/types/transactions";
import { useLiveQuery } from "dexie-react-hooks";

export async function syncMonthlySummary(
  txn: Transaction,
  mode: "add" | "remove",
) {
  const d = new Date(txn.date);

  if (isNaN(d.getTime())) throw new Error("Invalid transaction date");

  const id = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

  const current = await db.monthly_summaries.get(id);

  const summary = current ?? {
    id,
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    income: 0,
    expense: 0,
    adjustments: 0,
  };

  const factor = mode === "add" ? 1 : -1;
  const amountWithSign = txn.amount * factor;

  if (txn.categoryId === "system") {
    summary.adjustments = summary.adjustments += amountWithSign;
  } else if (txn.kind === "income") {
    summary.income += amountWithSign;
  } else {
    summary.expense += amountWithSign;
  }

  summary.adjustments = Number(summary.adjustments.toFixed(2));
  summary.income = Number(summary.income.toFixed(2));
  summary.expense = Number(summary.expense.toFixed(2));

  await db.monthly_summaries.put(summary);
}

export function useMonthlySummary(year: number, month: number) {
  const id = `${year}-${String(month).padStart(2, "0")}`;

  return (
    useLiveQuery(async () => {
      const summary = await db.monthly_summaries.get(id);
      return (
        summary ?? {
          id,
          income: 0,
          expense: 0,
          year,
          month,
        }
      );
    }, [id]) ?? { id, income: 0, expense: 0, year, month }
  );
}

export function useYearlySummary(year: number) {
  return (
    useLiveQuery(async () => {
      const summaries = await db.monthly_summaries
        .where("year")
        .equals(year)
        .toArray();

      return summaries.reduce(
        (acc, curr) => {
          acc.income += curr.income;
          acc.expense += curr.expense;
          acc.balance = acc.income - acc.expense;
          return acc;
        },
        { income: 0, expense: 0, balance: 0, year },
      );
    }, [year]) ?? { income: 0, expense: 0, balance: 0, year }
  );
}

export async function rebuildAllSummaries() {
  await db.monthly_summaries.clear();

  const transactions = await db.transactions
    .filter((t) => !t.transferId && t.archive === 0)
    .toArray();

  for (const txn of transactions) {
    await syncMonthlySummary(txn, "add");
  }
}
