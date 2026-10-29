import { updateAppState } from "../settings/update-app-state";
import { cancelScheduledSync } from "./schedule-sync";

export async function stopBackup() {
  cancelScheduledSync();

  await updateAppState({
    cloudProvider: undefined,
    backupId: undefined,
    backedAt: undefined,
  });
}
