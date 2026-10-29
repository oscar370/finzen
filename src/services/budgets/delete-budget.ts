import { db } from "@/lib/dexie/db";
import { BudgetNotFoundError } from "@/lib/errors/budget-not-found-error";
import { scheduleBackupSync } from "../backup/schedule-sync";

export async function deleteBudget(id: number) {
  const budget = await db.budgets.get(id);

  if (!budget) throw new BudgetNotFoundError();

  await db.budgets.update(id, { isDeleted: 1 });

  scheduleBackupSync();
}
