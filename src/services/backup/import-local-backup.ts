import { rebuildMonthlySummaries } from "../monthly-summary/rebuild-monthly-summaries";
import { updateAppState } from "../settings/update-app-state";
import { importBackup } from "./import-backup";

export async function importLocalBackup(file: File) {
  await importBackup(file);
  await rebuildMonthlySummaries();
  await updateAppState({ isAppInit: true });
}
