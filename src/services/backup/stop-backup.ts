import { updateAppState } from "../settings/update-app-state";

export async function stopBackup() {
  await updateAppState({
    cloudProvider: undefined,
    backupId: undefined,
    backedAt: undefined,
  });
}
