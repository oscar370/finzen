import { db } from "#/lib/db";
import type { DraftTransaction, Transaction } from "#/types/transactions";
import { vDraftTransaction, vTransaction } from "#/types/transactions";
import Dexie from "dexie";
import { parse } from "valibot";
import { syncMonthlySummary } from "./monthly-summary";
import { updateBalance } from "./settings";

export async function addTransaction(draftTransaction: DraftTransaction) {
  const transaction = parse(vDraftTransaction, draftTransaction);

  await db.transaction(
    "rw!",
    [db.transactions, db.categories, db.app_state, db.monthly_summaries],
    async () => {
      const category = await db.categories.get(transaction.categoryId);

      if (!category) throw new Error("The category does not exist");

      await Promise.all([
        await updateBalance(transaction, "add"),
        await db.transactions.add({
          ...transaction,
          categoryIcon: category.icon,
          categoryName: category.name,
          yearMonth: transaction.date.toISOString().slice(0, 7),
          isDeleted: 0,
        }),
        await syncMonthlySummary(transaction, "add"),
      ]);
    },
  );
}

export async function getIncomes(yearMonth: string, search?: string, categoryId?: number) {
  const collection = db.transactions
    .where("[kind+yearMonth+date+isDeleted]")
    .between(["income", yearMonth, Dexie.minKey, 0], ["income", yearMonth, Dexie.maxKey, 0])
    .reverse();

  let items = await collection.toArray();

  if (categoryId) items = items.filter((t) => t.categoryId === categoryId);
  if (search) {
    const s = search.toLowerCase();
    items = items.filter(
      (t) => t.name.toLowerCase().includes(s) || t.note.toLowerCase().includes(s),
    );
  }

  return items;
}

export async function getExpenses(yearMonth: string, search?: string, categoryId?: number) {
  const collection = db.transactions
    .where("[kind+yearMonth+date+isDeleted]")
    .between(["expense", yearMonth, Dexie.minKey, 0], ["expense", yearMonth, Dexie.maxKey, 0])
    .reverse();

  let items = await collection.toArray();

  if (categoryId) items = items.filter((t) => t.categoryId === categoryId);
  if (search) {
    const s = search.toLowerCase();
    items = items.filter(
      (t) => t.name.toLowerCase().includes(s) || t.note.toLowerCase().includes(s),
    );
  }

  return items;
}

export async function updateTransaction(updates: Transaction) {
  const transaction = parse(vTransaction, updates);

  await db.transaction(
    "rw!",
    [db.transactions, db.categories, db.monthly_summaries, db.app_state],
    async () => {
      const oldTransaction = await db.transactions.get(transaction.id);

      if (!oldTransaction) throw new Error("The transaction to be updated was not found");

      if (transaction.categoryId !== oldTransaction.categoryId) {
        const category = await db.categories.get(transaction.categoryId);
        if (!category) throw new Error("The category does not exist");

        await db.transactions.update(transaction.id, {
          ...transaction,
          categoryIcon: category.icon,
          categoryName: category.name,
          yearMonth: transaction.date.toISOString().slice(0, 7),
        });
      } else {
        await db.transactions.update(transaction.id, {
          ...transaction,
          yearMonth: transaction.date.toISOString().slice(0, 7),
        });
      }

      if (transaction.amount !== oldTransaction.amount) {
        await Promise.all([
          syncMonthlySummary(transaction, "remove"),
          updateBalance(transaction, "remove"),
        ]);

        await Promise.all([
          updateBalance(transaction, "add"),
          syncMonthlySummary(transaction, "add"),
        ]);
      }
    },
  );
}

export async function deleteTransaction(id: number, transaction: Transaction) {
  await db.transaction("rw!", [db.transactions, db.app_state, db.monthly_summaries], async () => {
    await Promise.all([
      db.transactions.update(id, { isDeleted: 1 }),
      syncMonthlySummary(transaction, "remove"),
      updateBalance(transaction, "remove"),
    ]);
  });
}
