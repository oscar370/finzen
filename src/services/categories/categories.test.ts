import { db } from "@/lib/dexie/db";
import { CategoryNotFoundError } from "@/lib/errors/category-not-found-error";
import { TransactionsAssociatedCategoryError } from "@/lib/errors/transactions-associated-category-error";
import { addBudget } from "@/services/budgets/add-budget";
import { addTransaction } from "@/services/transactions/add-transaction";
import { deleteTransaction } from "@/services/transactions/delete-transaction";
import {
  makeBudgetDraft,
  makeTransactionDraft,
  resetDatabase,
} from "@/test/db-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { addCategory } from "./add-category";
import { deleteCategory } from "./delete-category";
import { getCategories } from "./get-categories";
import { updateCategory } from "./update-category";

describe("categories services", () => {
  beforeEach(resetDatabase);

  it("adds a category with a trimmed name", async () => {
    const id = await addCategory({ name: "  Dining  ", icon: "utensils" });

    await expect(db.categories.get(id)).resolves.toMatchObject({
      id,
      name: "Dining",
      icon: "utensils",
      isDeleted: 0,
    });
  });

  it("rejects invalid category drafts", async () => {
    await expect(addCategory({ name: "   ", icon: "gift" })).rejects.toThrow();
  });

  it("returns active categories sorted by name", async () => {
    await addCategory({ name: "Zeta", icon: "gift" });
    await addCategory({ name: "Alpha", icon: "car" });

    const names = (await getCategories()).map((category) => category.name);

    expect(names).toEqual([...names].sort());
    expect(names).toContain("Alpha");
    expect(names).toContain("Zeta");
  });

  it("excludes soft-deleted categories", async () => {
    const id = await addCategory({ name: "Temporary", icon: "gift" });

    await deleteCategory(id);

    const names = (await getCategories()).map((category) => category.name);
    expect(names).not.toContain("Temporary");
  });

  it("updates a category and cascades its snapshot to budgets and transactions", async () => {
    const categoryId = await addCategory({
      name: "Dining",
      icon: "utensils",
    });
    const budgetId = await addBudget(makeBudgetDraft({ categoryId }));
    const transactionId = await addTransaction(
      makeTransactionDraft({ categoryId })
    );

    await updateCategory(categoryId, { name: "Restaurants", icon: "car" });

    await expect(db.categories.get(categoryId)).resolves.toMatchObject({
      name: "Restaurants",
      icon: "car",
    });
    await expect(db.budgets.get(budgetId)).resolves.toMatchObject({
      categoryName: "Restaurants",
      categoryIcon: "car",
    });
    await expect(db.transactions.get(transactionId)).resolves.toMatchObject({
      categoryName: "Restaurants",
      categoryIcon: "car",
    });
  });

  it("throws when updating a missing category", async () => {
    await expect(
      updateCategory(999, { name: "Missing", icon: "gift" })
    ).rejects.toBeInstanceOf(CategoryNotFoundError);
  });

  it("soft-deletes a category with no active transactions", async () => {
    const id = await addCategory({ name: "Temporary", icon: "gift" });

    await deleteCategory(id);

    await expect(db.categories.get(id)).resolves.toMatchObject({
      isDeleted: 1,
    });
  });

  it("refuses to delete a category with active transactions", async () => {
    const categoryId = await addCategory({
      name: "Dining",
      icon: "utensils",
    });
    await addTransaction(makeTransactionDraft({ categoryId }));

    await expect(deleteCategory(categoryId)).rejects.toBeInstanceOf(
      TransactionsAssociatedCategoryError
    );
  });

  it("deletes a category whose transactions are already soft-deleted", async () => {
    const categoryId = await addCategory({
      name: "Dining",
      icon: "utensils",
    });
    const transactionId = await addTransaction(
      makeTransactionDraft({ categoryId })
    );
    await deleteTransaction(transactionId);

    await deleteCategory(categoryId);

    await expect(db.categories.get(categoryId)).resolves.toMatchObject({
      isDeleted: 1,
    });
  });

  it("throws when deleting a missing category", async () => {
    await expect(deleteCategory(999)).rejects.toBeInstanceOf(
      CategoryNotFoundError
    );
  });
});
