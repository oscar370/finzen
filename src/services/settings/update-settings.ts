import type { AppState } from "@/types/app-state/app-state";
import { scheduleBackupSync } from "../backup/schedule-sync";
import { updateAppState } from "./update-app-state";

export async function updateSettings(updates: Partial<AppState>) {
  await updateAppState(updates);
  scheduleBackupSync();
}
