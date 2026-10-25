import { parseYearMonth } from "@/lib/utils/parse-year-month";
import type { MonthlySummary } from "@/types/monthly-summary/monthly-summary";
import type { Transaction } from "@/types/transactions/transaction";
import type { TransactionDraft } from "@/types/transactions/transaction-draft";

export function createMonthlySummary(yearMonth: string): MonthlySummary {
  const parts = parseYearMonth(yearMonth);

  if (!parts) throw new Error(`Invalid year-month: ${yearMonth}`);

  return {
    id: yearMonth,
    year: parts.year,
    month: parts.month + 1,
    income: 0,
    expense: 0,
    adjustments: 0,
  };
}

export function applyTransactionToSummary(
  summary: MonthlySummary,
  transaction: Pick<Transaction | TransactionDraft, "amount" | "kind">,
  mode: "add" | "remove"
): MonthlySummary {
  const factor = mode === "add" ? 1 : -1;
  const amountWithSign = transaction.amount * factor;

  const income =
    transaction.kind === "income"
      ? summary.income + amountWithSign
      : summary.income;
  const expense =
    transaction.kind === "expense"
      ? summary.expense + amountWithSign
      : summary.expense;

  return {
    ...summary,
    income: Number(income.toFixed(2)),
    expense: Number(expense.toFixed(2)),
    adjustments: Number((income - expense).toFixed(2)),
  };
}
