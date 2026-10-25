import { db } from "@/lib/dexie/db";
import { AppStateNotFoundError } from "@/lib/errors/app-state-not-found-error";
import type { AppState } from "@/types/app-state/app-state";

export async function getAppState(): Promise<AppState> {
  const appState = await db.app_state.get(0);

  if (!appState) throw new AppStateNotFoundError();

  return appState;
}
