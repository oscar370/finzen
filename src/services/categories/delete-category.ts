import { db } from "@/lib/dexie/db";
import { CategoryNotFoundError } from "@/lib/errors/category-not-found-error";
import { TransactionsAssociatedCategoryError } from "@/lib/errors/transactions-associated-category-error";

export async function deleteCategory(id: number) {
  await db.transaction("rw!", [db.categories, db.transactions], async () => {
    const category = await db.categories.get(id);

    if (!category) throw new CategoryNotFoundError();

    const transactions = await db.transactions
      .where("categoryId")
      .equals(id)
      .filter((transaction) => transaction.isDeleted === 0)
      .count();

    if (transactions > 0) throw new TransactionsAssociatedCategoryError();

    await db.categories.update(id, { isDeleted: 1 });
  });
}
