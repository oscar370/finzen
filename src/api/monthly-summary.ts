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
  };

  const factor = mode === "add" ? 1 : -1;
  const amountWithSign = txn.amount * factor;

  if (txn.kind === "income") {
    summary.income += amountWithSign;
  } else {
    summary.expense += amountWithSign;
  }

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

export async function rebuildMonthlySummary(year: number, month: number) {
  const start = new Date(year, month - 1, 1).getTime();
  const end = new Date(year, month, 0, 23, 59, 59).getTime();

  const txs = await db.transactions
    .where("date")
    .between(start, end, true, true)
    .filter((t) => t.archive === 0)
    .toArray();

  const totals = txs.reduce(
    (acc, tx) => {
      if (tx.kind === "income") acc.income += tx.amount;
      else acc.expense += tx.amount;
      return acc;
    },
    { income: 0, expense: 0 },
  );

  const id = `${year}-${String(month).padStart(2, "0")}`;
  await db.monthly_summaries.put({
    id,
    year,
    month,
    income: Number(totals.income.toFixed(2)),
    expense: Number(totals.expense.toFixed(2)),
  });
}
