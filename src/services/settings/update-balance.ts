import { db } from "@/lib/dexie/db";
import { calculateBalance, type BalanceTransaction } from "./calculate-balance";
import { getAppState } from "./get-app-state";

export async function updateBalance(
  transaction: BalanceTransaction,
  mode: "add" | "remove"
) {
  const appState = await getAppState();
  const balance = calculateBalance(appState.balance, transaction, mode);

  await db.app_state.update(appState.id, { balance });
}
