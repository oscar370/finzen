import { db } from "@/lib/dexie/db";
import { CategoryNotFoundError } from "@/lib/errors/category-not-found-error";
import {
  vCategoryDraft,
  type CategoryDraft,
} from "@/types/categories/category-draft";
import { parse } from "valibot";

export async function updateCategory(id: number, updates: CategoryDraft) {
  const category = parse(vCategoryDraft, updates);

  await db.transaction(
    "rw!",
    [db.categories, db.transactions, db.budgets],
    async () => {
      const current = await db.categories.get(id);

      if (!current) throw new CategoryNotFoundError();

      await db.categories.update(id, category);

      await Promise.all([
        db.transactions
          .where("categoryId")
          .equals(id)
          .modify({ categoryName: category.name, categoryIcon: category.icon }),
        db.budgets
          .where("categoryId")
          .equals(id)
          .modify({ categoryName: category.name, categoryIcon: category.icon }),
      ]);
    }
  );
}
