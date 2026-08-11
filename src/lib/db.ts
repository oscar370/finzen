import type { AppState } from "#/types/app-state";
import type { Budget } from "#/types/budgets";
import type { Category } from "#/types/categories";
import type { MonthlySummary } from "#/types/monthly-summaries";
import type { Transaction } from "#/types/transactions";
import type { EntityTable } from "dexie";
import Dexie from "dexie";
import { DEFAULT_CATEGORIES } from "./constants";

export const db = new Dexie("finzen") as Dexie & {
  app_state: EntityTable<AppState, "id">;
  transactions: EntityTable<Transaction, "id">;
  monthly_summaries: EntityTable<MonthlySummary, "id">;
  categories: EntityTable<Category, "id">;
  budgets: EntityTable<Budget, "id">;
};

db.version(1).stores({
  app_state: "id",
  transactions: "++id, date, kind, [categoryId+date+isDeleted], [kind+yearMonth+date+isDeleted]",
  monthly_summaries: "id, year, month",
  categories: "++id, name, isDeleted",
  budgets:
    "++id, lastBudgetsAddedAt, categoryName, [yearMonth+isDeleted], [yearMonth+kind+isDeleted], [kind+yearMonth+categoryId+isDeleted]",
});

db.on("populate", async () => {
  await Promise.all([seedCategories(), seedAppState()]);
});

async function seedCategories() {
  const count = await db.categories.count();
  if (count > 0) return;

  const categories: Category[] = DEFAULT_CATEGORIES.map((cat) => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    isDeleted: 0,
  }));

  await db.categories.bulkAdd(categories);
}

async function seedAppState() {
  const count = await db.app_state.count();
  if (count > 0) return;

  const appState: AppState = {
    id: 0,
    balance: 0,
    currency: "USD",
    isAppInit: false,
  };

  await db.app_state.add(appState);
}
