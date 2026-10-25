import { db } from "@/lib/dexie/db";
import { seedAppState } from "@/lib/dexie/seed-app-state";
import { seedCategories } from "@/lib/dexie/seed-categories";
import { parseYearMonth } from "@/lib/utils/parse-year-month";
import { toYearMonth } from "@/lib/utils/to-year-month";
import type { BudgetDraft } from "@/types/budgets/budget-draft";
import type { TransactionDraft } from "@/types/transactions/transaction-draft";

export const TEST_DATE = new Date(2026, 0, 15);
export const TEST_YEAR_MONTH = "2026-01";

export async function resetDatabase() {
  await db.delete();
  await db.open();
  await seedCategories();
  await seedAppState();
}

export function makeBudgetDraft(
  overrides: Partial<BudgetDraft> = {}
): BudgetDraft {
  return {
    amount: 100,
    yearMonth: TEST_YEAR_MONTH,
    kind: "expense",
    categoryId: 0,
    repeat: false,
    ...overrides,
  };
}

export function makeTransactionDraft(
  overrides: Partial<TransactionDraft> = {}
): TransactionDraft {
  return {
    name: "Test transaction",
    amount: 100,
    date: new Date(TEST_DATE),
    kind: "expense",
    note: "",
    categoryId: 0,
    ...overrides,
  };
}

export function toDate(yearMonth: string, day = 15): Date {
  const parts = parseYearMonth(yearMonth);

  if (!parts) throw new Error(`Invalid year-month: ${yearMonth}`);

  return new Date(parts.year, parts.month, day);
}

export function previousYearMonth(): string {
  const now = new Date();

  return toYearMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
}
