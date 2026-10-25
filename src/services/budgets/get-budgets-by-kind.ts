import { db } from "@/lib/dexie/db";

export function getBudgetsByKind(
  yearMonth: string,
  kind: "income" | "expense"
) {
  return db.budgets
    .where("[yearMonth+kind+isDeleted]")
    .equals([yearMonth, kind, 0])
    .sortBy("categoryName");
}
