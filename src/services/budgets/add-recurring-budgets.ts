import { db } from "@/lib/dexie/db";
import { currentYearMonth } from "@/lib/utils/current-year-month";
import { toYearMonth } from "@/lib/utils/to-year-month";
import { getAppState } from "../settings/get-app-state";
import { scheduleBackupSync } from "../backup/schedule-sync";
import { buildRecurringBudgets } from "./budget-rules";
import { getBudgets } from "./get-budgets";

export async function addRecurringBudgets() {
  const now = new Date();
  const currentKey = currentYearMonth();
  const appState = await getAppState();

  if (
    appState.lastBudgetsAddedAt &&
    toYearMonth(appState.lastBudgetsAddedAt) === currentKey
  ) {
    return;
  }

  const lastDate =
    appState.lastBudgetsAddedAt ??
    new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastKey = toYearMonth(lastDate);

  const [pastBudgets, existingBudgets] = await Promise.all([
    getBudgets(lastKey),
    getBudgets(currentKey),
  ]);

  const newBudgets = buildRecurringBudgets(
    pastBudgets,
    existingBudgets,
    currentKey
  );

  await db.transaction("rw!", [db.app_state, db.budgets], async () => {
    if (newBudgets.length > 0) {
      await db.budgets.bulkAdd(newBudgets);
    }

    await db.app_state.update(appState.id, {
      lastBudgetsAddedAt: now,
    });
  });

  if (newBudgets.length > 0) scheduleBackupSync();
}
