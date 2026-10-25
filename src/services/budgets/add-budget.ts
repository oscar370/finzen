import { db } from "@/lib/dexie/db";
import { CategoryNotFoundError } from "@/lib/errors/category-not-found-error";
import { vBudgetDraft, type BudgetDraft } from "@/types/budgets/budget-draft";
import { parse } from "valibot";
import { mergeBudgetAmount } from "./budget-rules";

export async function addBudget(draftBudget: BudgetDraft) {
  const budget = parse(vBudgetDraft, draftBudget);

  return db.transaction("rw!", [db.budgets, db.categories], async () => {
    const [category, existingBudget] = await Promise.all([
      db.categories.get(budget.categoryId),
      db.budgets
        .where("[kind+yearMonth+categoryId+isDeleted]")
        .equals([budget.kind, budget.yearMonth, budget.categoryId, 0])
        .first(),
    ]);

    if (!category || category.isDeleted) throw new CategoryNotFoundError();

    if (existingBudget) {
      await db.budgets.update(existingBudget.id, {
        amount: mergeBudgetAmount(existingBudget.amount, budget.amount),
      });

      return existingBudget.id;
    }

    return db.budgets.add({
      ...budget,
      categoryIcon: category.icon,
      categoryName: category.name,
      isDeleted: 0,
    });
  });
}
