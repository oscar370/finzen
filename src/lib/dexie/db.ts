import type { AppState } from "@/types/app-state/app-state";
import type { Budget } from "@/types/budgets/budget";
import type { Category } from "@/types/categories/category";
import type { MonthlySummary } from "@/types/monthly-summary/monthly-summary";
import type { Transaction } from "@/types/transactions/transaction";
import { Dexie, type EntityTable } from "dexie";
import { seedAppState } from "./seed-app-state";
import { seedCategories } from "./seed-categories";

type DB = Dexie & {
  app_state: EntityTable<AppState, "id">;
  transactions: EntityTable<Transaction, "id">;
  monthly_summaries: EntityTable<MonthlySummary, "id">;
  categories: EntityTable<Category, "id">;
  budgets: EntityTable<Budget, "id">;
};

export const db = new Dexie("finzen") as DB;

db.version(1).stores({
  app_state: "id",
  transactions:
    "++id, date, kind, [categoryId+date+isDeleted], [kind+yearMonth+date+isDeleted]",
  monthly_summaries: "id, year, month",
  categories: "++id, name, isDeleted",
  budgets:
    "++id, lastBudgetsAddedAt, categoryName, [yearMonth+isDeleted], [yearMonth+kind+isDeleted], [kind+yearMonth+categoryId+isDeleted]",
});

db.version(2).stores({
  app_state: "id",
  transactions: "++id, categoryId, [kind+yearMonth+date+isDeleted]",
  monthly_summaries: "id",
  categories: "++id, name, isDeleted",
  budgets:
    "++id, categoryId, categoryName, [yearMonth+isDeleted], [yearMonth+kind+isDeleted], [kind+yearMonth+categoryId+isDeleted]",
});

db.on("populate", async () => {
  await Promise.all([seedCategories(), seedAppState()]);
});
