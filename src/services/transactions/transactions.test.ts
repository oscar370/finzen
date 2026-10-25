import { db } from "@/lib/dexie/db";
import { CategoryNotFoundError } from "@/lib/errors/category-not-found-error";
import { TransactionNotFoundError } from "@/lib/errors/transaction-not-found-error";
import { addCategory } from "@/services/categories/add-category";
import { deleteCategory } from "@/services/categories/delete-category";
import { getMonthlySummary } from "@/services/monthly-summary/get-monthly-summary";
import { getAppState } from "@/services/settings/get-app-state";
import { makeTransactionDraft, resetDatabase } from "@/test/db-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { addTransaction } from "./add-transaction";
import { deleteTransaction } from "./delete-transaction";
import { getTransactionsByKind } from "./get-transactions-by-kind";
import { updateTransaction } from "./update-transaction";

describe("transactions services", () => {
  beforeEach(resetDatabase);

  it("adds a transaction with a category snapshot and updates balance and summary", async () => {
    const expenseId = await addTransaction(
      makeTransactionDraft({
        name: "Groceries",
        amount: 100,
        kind: "expense",
        date: new Date(2026, 0, 15),
        note: "weekly",
      })
    );

    await expect(db.transactions.get(expenseId)).resolves.toMatchObject({
      id: expenseId,
      name: "Groceries",
      amount: 100,
      kind: "expense",
      note: "weekly",
      categoryId: 0,
      categoryName: "category_food",
      categoryIcon: "utensils",
      yearMonth: "2026-01",
      isDeleted: 0,
    });
    await expect(getAppState()).resolves.toMatchObject({ balance: -100 });
    await expect(getMonthlySummary("2026-01")).resolves.toMatchObject({
      income: 0,
      expense: 100,
      adjustments: -100,
    });

    await addTransaction(
      makeTransactionDraft({
        amount: 250,
        kind: "income",
        date: new Date(2026, 0, 10),
      })
    );

    await expect(getAppState()).resolves.toMatchObject({ balance: 150 });
    await expect(getMonthlySummary("2026-01")).resolves.toMatchObject({
      income: 250,
      expense: 100,
      adjustments: 150,
    });
  });

  it("throws when adding with a missing or deleted category", async () => {
    await expect(
      addTransaction(makeTransactionDraft({ categoryId: 999 }))
    ).rejects.toBeInstanceOf(CategoryNotFoundError);

    const categoryId = await addCategory({ name: "Temp", icon: "gift" });
    await deleteCategory(categoryId);

    await expect(
      addTransaction(makeTransactionDraft({ categoryId }))
    ).rejects.toBeInstanceOf(CategoryNotFoundError);
  });

  it("returns active transactions by kind sorted by date descending", async () => {
    const oldIncomeId = await addTransaction(
      makeTransactionDraft({
        amount: 100,
        kind: "income",
        date: new Date(2026, 0, 10),
      })
    );
    const expenseId = await addTransaction(
      makeTransactionDraft({
        amount: 50,
        kind: "expense",
        date: new Date(2026, 0, 20),
      })
    );
    const newIncomeId = await addTransaction(
      makeTransactionDraft({
        amount: 25,
        kind: "income",
        date: new Date(2026, 0, 15),
      })
    );
    const deletedExpenseId = await addTransaction(
      makeTransactionDraft({
        amount: 10,
        kind: "expense",
        date: new Date(2026, 0, 25),
      })
    );
    await deleteTransaction(deletedExpenseId);

    const incomes = await getTransactionsByKind("2026-01", "income");
    expect(incomes.map((transaction) => transaction.id)).toEqual([
      newIncomeId,
      oldIncomeId,
    ]);

    const expenses = await getTransactionsByKind("2026-01", "expense");
    expect(expenses.map((transaction) => transaction.id)).toEqual([expenseId]);
  });

  it("updates a transaction and recalculates balance and summary", async () => {
    const id = await addTransaction(
      makeTransactionDraft({
        amount: 100,
        kind: "expense",
        date: new Date(2026, 0, 15),
      })
    );

    const updated = await updateTransaction(
      id,
      makeTransactionDraft({
        name: "Salary",
        amount: 150,
        kind: "income",
        date: new Date(2026, 0, 15),
        categoryId: 1,
        note: "bonus",
      })
    );

    expect(updated).toMatchObject({
      id,
      name: "Salary",
      amount: 150,
      kind: "income",
      categoryId: 1,
      categoryName: "category_transport",
      categoryIcon: "car",
      yearMonth: "2026-01",
    });
    await expect(getAppState()).resolves.toMatchObject({ balance: 150 });
    await expect(getMonthlySummary("2026-01")).resolves.toMatchObject({
      income: 150,
      expense: 0,
      adjustments: 150,
    });
  });

  it("moves a transaction between monthly summaries when its date changes", async () => {
    const id = await addTransaction(
      makeTransactionDraft({
        amount: 100,
        kind: "expense",
        date: new Date(2026, 0, 15),
      })
    );

    await updateTransaction(
      id,
      makeTransactionDraft({
        amount: 100,
        kind: "expense",
        date: new Date(2026, 1, 10),
      })
    );

    await expect(getMonthlySummary("2026-01")).resolves.toMatchObject({
      income: 0,
      expense: 0,
      adjustments: 0,
    });
    await expect(getMonthlySummary("2026-02")).resolves.toMatchObject({
      income: 0,
      expense: 100,
      adjustments: -100,
    });
    await expect(getAppState()).resolves.toMatchObject({ balance: -100 });
  });

  it("throws when updating a missing transaction", async () => {
    await expect(
      updateTransaction(999, makeTransactionDraft())
    ).rejects.toBeInstanceOf(TransactionNotFoundError);
  });

  it("throws when updating with a missing category", async () => {
    const id = await addTransaction(makeTransactionDraft());

    await expect(
      updateTransaction(id, makeTransactionDraft({ categoryId: 999 }))
    ).rejects.toBeInstanceOf(CategoryNotFoundError);
  });

  it("soft-deletes a transaction and reverses balance and summary", async () => {
    const id = await addTransaction(
      makeTransactionDraft({
        amount: 100,
        kind: "expense",
        date: new Date(2026, 0, 15),
      })
    );

    await deleteTransaction(id);

    await expect(db.transactions.get(id)).resolves.toMatchObject({
      isDeleted: 1,
    });
    await expect(getAppState()).resolves.toMatchObject({ balance: 0 });
    await expect(getMonthlySummary("2026-01")).resolves.toMatchObject({
      income: 0,
      expense: 0,
      adjustments: 0,
    });

    await deleteTransaction(id);
    await expect(getAppState()).resolves.toMatchObject({ balance: 0 });
  });

  it("throws when deleting a missing transaction", async () => {
    await expect(deleteTransaction(999)).rejects.toBeInstanceOf(
      TransactionNotFoundError
    );
  });
});
