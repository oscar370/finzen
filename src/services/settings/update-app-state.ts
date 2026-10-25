import { db } from "@/lib/dexie/db";
import type { AppState } from "@/types/app-state/app-state";

export async function updateAppState(updates: Partial<AppState>) {
  await db.app_state.update(0, updates);
}
