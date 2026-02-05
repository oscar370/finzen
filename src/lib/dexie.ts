import { seedCategories } from "@/api/categories";
import type { Account } from "@/types/accounts";
import type { Budget } from "@/types/budgets";
import type { Category } from "@/types/categories";
import type { MonthlySummary } from "@/types/monthly-summary";
import type { Transaction } from "@/types/transactions";
import { Dexie, type EntityTable } from "dexie";

export const db = new Dexie("finances") as Dexie & {
  accounts: EntityTable<Account, "id">;
  transactions: EntityTable<Transaction, "id">;
  monthly_summaries: EntityTable<MonthlySummary, "id">;
  categories: EntityTable<Category, "id">;
  budget: EntityTable<Budget, "id">;
};

db.version(1).stores({
  accounts: "id, name, type, archive, updatedAt",

  transactions:
    "id, date, kind, accountId, categoryId, [archive+date], [archive+kind+date]",

  monthly_summaries: "id, year, month",

  categories: "id, name, archive, updatedAt",

  budget: "id, [year+month]",
});

db.on("populate", () => {
  seedCategories();
});
