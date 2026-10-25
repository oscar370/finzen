import { db } from "@/lib/dexie/db";
import { BudgetNotFoundError } from "@/lib/errors/budget-not-found-error";
import { CategoryNotFoundError } from "@/lib/errors/category-not-found-error";
import { currentYearMonth } from "@/lib/utils/current-year-month";
import { addCategory } from "@/services/categories/add-category";
import { deleteCategory } from "@/services/categories/delete-category";
import { getAppState } from "@/services/settings/get-app-state";
import { updateAppState } from "@/services/settings/update-app-state";
import {
  makeBudgetDraft,
  previousYearMonth,
  resetDatabase,
  TEST_YEAR_MONTH,
  toDate,
} from "@/test/db-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { addBudget } from "./add-budget";
import { addRecurringBudgets } from "./add-recurring-budgets";
import { deleteBudget } from "./delete-budget";
import { getBudgets } from "./get-budgets";
import { getBudgetsByKind } from "./get-budgets-by-kind";
import { updateBudget } from "./update-budget";

describe("budgets services", () => {
  beforeEach(resetDatabase);

  it("adds a budget with a category snapshot", async () => {
    const id = await addBudget(
      makeBudgetDraft({ categoryId: 0, amount: 250, repeat: true })
    );

    await expect(db.budgets.get(id)).resolves.toMatchObject({
      id,
      amount: 250,
      categoryId: 0,
      categoryName: "category_food",
      categoryIcon: "utensils",
      yearMonth: TEST_YEAR_MONTH,
      repeat: true,
      isDeleted: 0,
    });
  });

  it("merges a budget with the same kind, month, and category", async () => {
    const firstId = await addBudget(makeBudgetDraft({ amount: 100 }));
    const secondId = await addBudget(makeBudgetDraft({ amount: 50 }));

    expect(secondId).toBe(firstId);
    await expect(db.budgets.get(firstId)).resolves.toMatchObject({
      amount: 150,
    });
    await expect(db.budgets.count()).resolves.toBe(1);
  });

  it("throws when adding a budget for a missing category", async () => {
    await expect(
      addBudget(makeBudgetDraft({ categoryId: 999 }))
    ).rejects.toBeInstanceOf(CategoryNotFoundError);
  });

  it("throws when adding a budget for a deleted category", async () => {
    const categoryId = await addCategory({ name: "Temp", icon: "gift" });
    await deleteCategory(categoryId);

    await expect(
      addBudget(makeBudgetDraft({ categoryId }))
    ).rejects.toBeInstanceOf(CategoryNotFoundError);
  });

  it("returns active budgets for a month and kind", async () => {
    await addBudget(makeBudgetDraft({ categoryId: 0 }));
    await addBudget(makeBudgetDraft({ categoryId: 1 }));
    await addBudget(makeBudgetDraft({ categoryId: 6, kind: "income" }));
    const deletedId = await addBudget(makeBudgetDraft({ categoryId: 2 }));
    await deleteBudget(deletedId);

    const budgets = await getBudgets(TEST_YEAR_MONTH);
    expect(budgets.map((budget) => budget.categoryName)).toEqual([
      "category_food",
      "category_salary",
      "category_transport",
    ]);

    const expenses = await getBudgetsByKind(TEST_YEAR_MONTH, "expense");
    expect(expenses.map((budget) => budget.categoryName)).toEqual([
      "category_food",
      "category_transport",
    ]);
  });

  it("updates a budget and preserves its related budget", async () => {
    const id = await addBudget(
      makeBudgetDraft({ categoryId: 0, amount: 100, relatedBudget: 42 })
    );

    await updateBudget(
      id,
      makeBudgetDraft({
        categoryId: 1,
        amount: 250,
        relatedBudget: 99,
      })
    );

    await expect(db.budgets.get(id)).resolves.toMatchObject({
      id,
      amount: 250,
      categoryId: 1,
      categoryName: "category_transport",
      categoryIcon: "car",
      relatedBudget: 42,
    });
  });

  it("merges into an existing budget and soft-deletes the conflict", async () => {
    const firstId = await addBudget(
      makeBudgetDraft({ categoryId: 0, amount: 100 })
    );
    const secondId = await addBudget(
      makeBudgetDraft({ categoryId: 1, amount: 50 })
    );

    await updateBudget(firstId, makeBudgetDraft({ categoryId: 1, amount: 25 }));

    await expect(db.budgets.get(firstId)).resolves.toMatchObject({
      amount: 75,
      categoryName: "category_transport",
      isDeleted: 0,
    });
    await expect(db.budgets.get(secondId)).resolves.toMatchObject({
      isDeleted: 1,
    });
  });

  it("throws when updating a missing budget", async () => {
    await expect(updateBudget(999, makeBudgetDraft())).rejects.toBeInstanceOf(
      BudgetNotFoundError
    );
  });

  it("throws when updating a budget with a missing category", async () => {
    const id = await addBudget(makeBudgetDraft());

    await expect(
      updateBudget(id, makeBudgetDraft({ categoryId: 999 }))
    ).rejects.toBeInstanceOf(CategoryNotFoundError);
  });

  it("soft-deletes a budget", async () => {
    const id = await addBudget(makeBudgetDraft());

    await deleteBudget(id);

    await expect(db.budgets.get(id)).resolves.toMatchObject({
      isDeleted: 1,
    });
  });

  it("throws when deleting a missing budget", async () => {
    await expect(deleteBudget(999)).rejects.toBeInstanceOf(BudgetNotFoundError);
  });

  it("copies repeating budgets into the current month only once", async () => {
    const previous = previousYearMonth();
    const current = currentYearMonth();
    await updateAppState({ lastBudgetsAddedAt: toDate(previous) });

    const repeatingId = await addBudget(
      makeBudgetDraft({
        yearMonth: previous,
        categoryId: 0,
        amount: 100,
        repeat: true,
      })
    );
    await addBudget(
      makeBudgetDraft({
        yearMonth: previous,
        categoryId: 1,
        repeat: false,
      })
    );

    await addRecurringBudgets();

    const currentBudgets = await getBudgets(current);
    expect(currentBudgets).toHaveLength(1);
    expect(currentBudgets[0]).toMatchObject({
      relatedBudget: repeatingId,
      yearMonth: current,
      categoryName: "category_food",
      amount: 100,
      isDeleted: 0,
    });
    await expect(getAppState()).resolves.toMatchObject({
      lastBudgetsAddedAt: expect.any(Date),
    });

    await addRecurringBudgets();
    await expect(getBudgets(current)).resolves.toHaveLength(1);
  });

  it("does nothing when budgets were already added this month", async () => {
    const previous = previousYearMonth();
    const current = currentYearMonth();
    await addBudget(
      makeBudgetDraft({
        yearMonth: previous,
        categoryId: 0,
        repeat: true,
      })
    );
    await updateAppState({ lastBudgetsAddedAt: new Date() });

    await addRecurringBudgets();

    await expect(getBudgets(current)).resolves.toEqual([]);
  });
});
