import { db } from "@/lib/dexie/db";

export function getBudgets(yearMonth: string) {
  return db.budgets
    .where("[yearMonth+isDeleted]")
    .equals([yearMonth, 0])
    .sortBy("categoryName");
}
