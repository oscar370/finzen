import type { Budget } from "@/types/budgets/budget";
import { describe, expect, it } from "vitest";
import { buildRecurringBudgets, mergeBudgetAmount } from "./budget-rules";

function makeBudget(overrides: Partial<Budget> = {}): Budget {
  return {
    id: 1,
    amount: 100,
    yearMonth: "2026-01",
    kind: "expense",
    categoryId: 0,
    categoryIcon: "utensils",
    categoryName: "category_food",
    repeat: false,
    isDeleted: 0,
    ...overrides,
  };
}

describe("mergeBudgetAmount", () => {
  it("adds the incoming amount to the existing amount", () => {
    expect(mergeBudgetAmount(100, 25)).toBe(125);
  });
});

describe("buildRecurringBudgets", () => {
  it("copies repeating budgets into the current month", () => {
    const pastBudget = makeBudget({
      id: 5,
      repeat: true,
      relatedBudget: 2,
      yearMonth: "2026-09",
    });

    const { id: _id, ...pastBudgetWithoutId } = pastBudget;

    expect(buildRecurringBudgets([pastBudget], [], "2026-10")).toEqual([
      {
        ...pastBudgetWithoutId,
        relatedBudget: 5,
        yearMonth: "2026-10",
      },
    ]);
  });

  it("ignores budgets that do not repeat", () => {
    const pastBudget = makeBudget({ id: 5, repeat: false });

    expect(buildRecurringBudgets([pastBudget], [], "2026-10")).toEqual([]);
  });

  it("ignores budgets already linked from the current month", () => {
    const pastBudget = makeBudget({ id: 5, repeat: true });
    const existingBudget = makeBudget({
      id: 9,
      yearMonth: "2026-10",
      relatedBudget: 5,
    });

    expect(
      buildRecurringBudgets([pastBudget], [existingBudget], "2026-10")
    ).toEqual([]);
  });
});
