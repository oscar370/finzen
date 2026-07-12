import { db } from "#/lib/db";
import type { Budget, DraftBudget } from "#/types/budgets";
import { vBudget, vDraftBudget } from "#/types/budgets";
import { parse } from "valibot";

export async function addBudget(draftBudget: DraftBudget) {
  const budget = parse(vDraftBudget, draftBudget);

  await db.transaction("rw!", [db.budgets, db.categories], async () => {
    const [category, existingBudget] = await Promise.all([
      db.categories.where("id").equals(budget.categoryId).first(),
      db.budgets
        .where("[kind+yearMonth+categoryId]")
        .equals([budget.kind, budget.yearMonth, budget.categoryId])
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
    });
  });
}

export function getBudgets(yearMonth: string) {
  return db.budgets.where("yearMonth").equals(yearMonth).sortBy("categoryName");
}

export function getBudgetsByKind(yearMonth: string, type: "expense" | "income") {
  return db.budgets.where("[yearMonth+kind]").equals([yearMonth, type]).toArray();
}

export async function updateBudget(updates: Budget) {
  const budget = parse(vBudget, updates);

  await db.transaction("rw!", [db.budgets, db.categories], async () => {
    const [oldBudget, category, existingBudget] = await Promise.all([
      db.budgets.get(budget.id),
      db.categories.where("id").equals(budget.categoryId).first(),
      db.budgets
        .where("[kind+yearMonth+categoryId]")
        .equals([budget.kind, budget.yearMonth, budget.categoryId])
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
  await db.budgets.delete(id);
}
