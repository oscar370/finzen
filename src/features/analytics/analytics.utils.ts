import type { Budget } from "#/types/budgets";
import type { Transaction } from "#/types/transactions";

type BudgetSummaryMap = Map<
  number,
  {
    name: string;
    budgeted: number;
    real: number;
    difference: number;
  }
>;

export function buildBudgetSummary(
  budgets: Budget[],
  transactions: Transaction[],
  type: "expense" | "income",
) {
  const summaryMap = new Map() as BudgetSummaryMap;

  for (const budget of budgets) {
    summaryMap.set(budget.categoryId, {
      name: budget.categoryName,
      budgeted: budget.amount,
      real: 0,
      difference: 0,
    });
  }

  for (const transaction of transactions) {
    const existing = summaryMap.get(transaction.categoryId);

    if (existing) {
      existing.real += transaction.amount;
    } else {
      summaryMap.set(transaction.categoryId, {
        name: transaction.categoryName,
        budgeted: 0,
        real: transaction.amount,
        difference: 0,
      });
    }
  }

  return Array.from(summaryMap.values()).map((row) => {
    if (type === "expense") row.difference = Number((row.budgeted - row.real).toFixed(2));
    else row.difference = Number((row.real - row.budgeted).toFixed(2));

    return row;
  });
}
