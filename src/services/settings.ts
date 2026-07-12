import { db } from "#/lib/db";
import type { AppState } from "#/types/app-state";
import type { DraftTransaction, Transaction } from "#/types/transactions";
import type { PromiseExtended } from "dexie";

export function getAppState() {
  return db.app_state.get(0) as PromiseExtended<AppState>;
}

export async function updateAppState(updates: Partial<AppState>) {
  await db.app_state.update(0, updates);
}

export async function updateBalance(
  transaction: Transaction | DraftTransaction,
  mode: "add" | "remove",
) {
  const appState = await getAppState();
  let balance;

  if (mode === "add") {
    const factor = transaction.kind === "income" ? 1 : -1;
    const amountWithSign = transaction.amount * factor;
    balance = appState.balance += amountWithSign;
  } else {
    const factor = transaction.kind === "income" ? -1 : 1;
    const amountWithSign = transaction.amount * factor;
    balance = appState.balance += amountWithSign;
  }

  await db.app_state.update(0, { balance });
}
