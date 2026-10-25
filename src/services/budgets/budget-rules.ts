import type { Budget } from "@/types/budgets/budget";

export function mergeBudgetAmount(
  existingAmount: number,
  incomingAmount: number
): number {
  return existingAmount + incomingAmount;
}

export function buildRecurringBudgets(
  pastBudgets: Budget[],
  existingBudgets: Budget[],
  currentYearMonth: string
): Array<Omit<Budget, "id">> {
  const existingRelatedIds = new Set(
    existingBudgets
      .map((budget) => budget.relatedBudget)
      .filter((id): id is number => typeof id === "number")
  );

  return pastBudgets
    .filter((budget) => budget.repeat && !existingRelatedIds.has(budget.id))
    .map(({ id, ...budget }) => ({
      ...budget,
      relatedBudget: id,
      yearMonth: currentYearMonth,
    }));
}
