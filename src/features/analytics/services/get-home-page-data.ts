import { getBudgetsByKind } from "@/services/budgets/get-budgets-by-kind";
import { getMonthlySummary } from "@/services/monthly-summary/get-monthly-summary";
import { getAppState } from "@/services/settings/get-app-state";
import { getTransactionsByKind } from "@/services/transactions/get-transactions-by-kind";

export async function getHomePageData({ yearMonth }: { yearMonth: string }) {
  const [
    appState,
    monthlySummary,
    incomeBudgets,
    expenseBudgets,
    incomes,
    expenses,
  ] = await Promise.all([
    getAppState(),
    getMonthlySummary(yearMonth),
    getBudgetsByKind(yearMonth, "income"),
    getBudgetsByKind(yearMonth, "expense"),
    getTransactionsByKind(yearMonth, "income"),
    getTransactionsByKind(yearMonth, "expense"),
  ]);

  return {
    appState,
    monthlySummary,
    incomeBudgets,
    expenseBudgets,
    incomes,
    expenses,
  };
}
