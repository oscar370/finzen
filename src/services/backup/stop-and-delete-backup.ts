import { deleteBackup } from "../google-drive/delete-backup";
import { getAppState } from "../settings/get-app-state";
import { updateAppState } from "../settings/update-app-state";

export async function stopAndDeleteBackup() {
  const appState = await getAppState();

  if (appState.backupId) {
    await deleteBackup(appState.backupId);
  }

  await updateAppState({
    cloudProvider: undefined,
    backupId: undefined,
    backedAt: undefined,
  });
}
