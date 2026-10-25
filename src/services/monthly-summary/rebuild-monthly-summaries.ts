import { db } from "@/lib/dexie/db";
import { parseYearMonth } from "@/lib/utils/parse-year-month";
import { toYearMonth } from "@/lib/utils/to-year-month";
import type { MonthlySummary } from "@/types/monthly-summary/monthly-summary";

export async function rebuildMonthlySummaries() {
  await db.transaction(
    "rw!",
    [db.transactions, db.monthly_summaries],
    async () => {
      const transactions = await db.transactions
        .filter((transaction) => transaction.isDeleted === 0)
        .toArray();

      const summaries = new Map<string, MonthlySummary>();

      for (const transaction of transactions) {
        const yearMonth = toYearMonth(transaction.date);
        const parts = parseYearMonth(yearMonth);
        if (!parts) continue;

        const summary = summaries.get(yearMonth) ?? {
          id: yearMonth,
          year: parts.year,
          month: parts.month + 1,
          income: 0,
          expense: 0,
          adjustments: 0,
        };

        if (transaction.kind === "income") {
          summary.income += transaction.amount;
        } else {
          summary.expense += transaction.amount;
        }

        summaries.set(yearMonth, summary);
      }

      for (const summary of summaries.values()) {
        summary.income = Number(summary.income.toFixed(2));
        summary.expense = Number(summary.expense.toFixed(2));
        summary.adjustments = Number(
          (summary.income - summary.expense).toFixed(2)
        );
      }

      await db.monthly_summaries.clear();
      await db.monthly_summaries.bulkPut([...summaries.values()]);
    }
  );
}
