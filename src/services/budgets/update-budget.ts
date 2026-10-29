import { db } from "@/lib/dexie/db";
import { BudgetNotFoundError } from "@/lib/errors/budget-not-found-error";
import { CategoryNotFoundError } from "@/lib/errors/category-not-found-error";
import { vBudgetDraft, type BudgetDraft } from "@/types/budgets/budget-draft";
import { parse } from "valibot";
import { scheduleBackupSync } from "../backup/schedule-sync";
import { mergeBudgetAmount } from "./budget-rules";

export async function updateBudget(id: number, updates: BudgetDraft) {
  const budget = parse(vBudgetDraft, updates);

  await db.transaction("rw!", [db.budgets, db.categories], async () => {
    const [oldBudget, category, existingBudget] = await Promise.all([
      db.budgets.get(id),
      db.categories.get(budget.categoryId),
      db.budgets
        .where("[kind+yearMonth+categoryId+isDeleted]")
        .equals([budget.kind, budget.yearMonth, budget.categoryId, 0])
        .first(),
    ]);

    if (!oldBudget) throw new BudgetNotFoundError();
    if (!category || category.isDeleted) throw new CategoryNotFoundError();

    if (existingBudget && existingBudget.id !== id) {
      await db.budgets.update(existingBudget.id, { isDeleted: 1 });

      await db.budgets.put({
        id,
        ...budget,
        amount: mergeBudgetAmount(existingBudget.amount, budget.amount),
        relatedBudget: oldBudget.relatedBudget,
        categoryIcon: category.icon,
        categoryName: category.name,
        isDeleted: 0,
      });

      return;
    }

    await db.budgets.put({
      id,
      ...budget,
      relatedBudget: oldBudget.relatedBudget,
      categoryIcon: category.icon,
      categoryName: category.name,
      isDeleted: 0,
    });
  });

  scheduleBackupSync();
}
