import { db } from "#/lib/db";
import { m } from "#/paraglide/messages";
import type { Category, CategoryDraft } from "#/types/categories";
import { vCategory, vDraftCategory } from "#/types/categories";
import { parse } from "valibot";

export async function addCategory(draftCategory: CategoryDraft) {
  const category = parse(vDraftCategory, draftCategory);
  await db.categories.add({ ...category, isDeleted: 0 });
}

export function getCategories() {
  return db.categories.where("isDeleted").equals(0).sortBy("name");
}

export async function updateCategory(updates: Category) {
  const category = parse(vCategory, updates);

  await db.transaction("rw!", [db.categories, db.transactions], async () => {
    await Promise.all([
      db.transactions
        .where("categoryId")
        .equals(category.id)
        .modify({ categoryName: category.name, categoryIcon: category.icon }),
      db.categories.update(category.id, category),
    ]);
  });
}

export async function deleteCategory(id: number) {
  await db.transaction("rw!", [db.categories, db.transactions], async () => {
    const transactions = await db.transactions.where("categoryId").equals(id).count();

    if (transactions > 0) throw new Error(m["errors.transactions_associated_category"]());

    await db.categories.update(id, { isDeleted: 1 });
  });
}
