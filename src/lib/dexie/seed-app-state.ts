import type { AppState } from "@/types/app-state/app-state";
import { db } from "./db";

export const INITIAL_APP_STATE: AppState = {
  id: 0,
  balance: 0,
  currency: "USD",
  isAppInit: false,
  regionalFormat: "en-US",
};

export async function seedAppState() {
  const count = await db.app_state.count();
  if (count > 0) return;

  await db.app_state.add(INITIAL_APP_STATE);
}
