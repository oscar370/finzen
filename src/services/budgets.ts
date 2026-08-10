import { db } from "#/lib/db";
import { formatYearMonth } from "#/lib/utils";
import type { Budget, DraftBudget } from "#/types/budgets";
import { vBudget, vDraftBudget } from "#/types/budgets";
import { parse } from "valibot";
import { getAppState, updateAppState } from "./settings";

export async function addBudget(draftBudget: DraftBudget) {
  const budget = parse(vDraftBudget, draftBudget);

  await db.transaction("rw!", [db.budgets, db.categories], async () => {
    const [category, existingBudget] = await Promise.all([
      db.categories.where("id").equals(budget.categoryId).first(),
      db.budgets
        .where("[kind+yearMonth+categoryId+isDeleted]")
        .equals([budget.kind, budget.yearMonth, budget.categoryId, 0])
        .first(),
    ]);

    if (!category) throw new Error("The category does not exist");

    if (existingBudget) {
      await db.budgets.update(existingBudget.id, {
        amount: existingBudget.amount + budget.amount,
      });

      return;
    }

    await db.budgets.add({
      ...budget,
      categoryIcon: category.icon,
      categoryName: category.name,
      isDeleted: 0,
    });
  });
}

export function getBudgets(yearMonth: string) {
  return db.budgets.where("[yearMonth+isDeleted]").equals([yearMonth, 0]).sortBy("categoryName");
}

export function getBudgetsByKind(yearMonth: string, type: "expense" | "income") {
  return db.budgets.where("[yearMonth+kind+isDeleted]").equals([yearMonth, type, 0]).toArray();
}

export async function updateBudget(updates: Budget) {
  const budget = parse(vBudget, updates);

  await db.transaction("rw!", [db.budgets, db.categories], async () => {
    const [oldBudget, category, existingBudget] = await Promise.all([
      db.budgets.get(budget.id),
      db.categories.where("id").equals(budget.categoryId).first(),
      db.budgets
        .where("[kind+yearMonth+categoryId+isDeleted]")
        .equals([budget.kind, budget.yearMonth, budget.categoryId, 0])
        .first(),
    ]);

    if (!oldBudget) throw new Error("The budget does not exist");
    if (!category) throw new Error("The category does not exist");

    if (existingBudget && existingBudget.id !== budget.id) {
      await db.budgets.delete(existingBudget.id);

      await db.budgets.update(budget.id, {
        ...budget,
        amount: existingBudget.amount + budget.amount,
        categoryIcon: category.icon,
        categoryName: category.name,
      });

      return;
    }

    if (oldBudget.categoryId !== budget.categoryId) {
      await db.budgets.update(budget.id, {
        ...budget,
        categoryIcon: category.icon,
        categoryName: category.name,
      });

      return;
    }

    await db.budgets.update(budget.id, {
      ...budget,
    });
  });
}

export async function deleteBudget(id: number) {
  await db.budgets.update(id, { isDeleted: 1 });
}

type RecurringBudgets = {
  amount: number;
  yearMonth: string;
  kind: "expense" | "income";
  categoryId: number;
  repeat: boolean;
  relatedBudget?: number | undefined;
  categoryIcon: string;
  categoryName: string;
  isDeleted: 1 | 0;
};

export async function addRecurringBudgets() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentKey = formatYearMonth(currentYear, currentMonth);

  const appState = await getAppState();
  if (appState.lastBudgetsAddedAt) {
    const lastYearAt = appState.lastBudgetsAddedAt.getFullYear();
    const lastMonthAt = appState.lastBudgetsAddedAt.getMonth();
    if (lastYearAt === currentYear && lastMonthAt === currentMonth) return;
  }

  let lastYear = currentYear;
  let lastMonth = currentMonth - 1;

  if (appState.lastBudgetsAddedAt) {
    lastYear = appState.lastBudgetsAddedAt.getFullYear();
    lastMonth = appState.lastBudgetsAddedAt.getMonth();
  } else if (lastMonth < 0) {
    lastMonth = 11;
    lastYear -= 1;
  }

  const lastKey = formatYearMonth(lastYear, lastMonth);

  const [pastBudgets, existingCurrentBudgets] = await Promise.all([
    db.budgets.where("yearMonth").equals(lastKey).toArray(),
    db.budgets.where("yearMonth").equals(currentKey).toArray(),
  ]);

  const existingRelatedIds = new Set(
    existingCurrentBudgets.map((b) => b.relatedBudget).filter(Boolean),
  );

  const newBudgets: RecurringBudgets[] = [];
  for (const budget of pastBudgets) {
    if (budget.repeat && !existingRelatedIds.has(budget.id)) {
      const { id, ...rest } = budget;
      newBudgets.push({
        ...rest,
        relatedBudget: id,
        yearMonth: currentKey,
      });
    }
  }

  if (newBudgets.length === 0) {
    await db.app_state.update(appState.id, { lastBudgetsAddedAt: now });
    return;
  }

  await db.transaction("rw", [db.app_state, db.budgets], async () => {
    await Promise.all([
      await db.budgets.bulkAdd(newBudgets),
      await updateAppState({ lastBudgetsAddedAt: now }),
    ]);
  });
}
