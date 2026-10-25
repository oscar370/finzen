import { getBackupContent } from "../google-drive/get-backup-content";
import { getBackupMetadata } from "../google-drive/get-backup-metadata";
import { updateBackup } from "../google-drive/update-backup";
import { rebuildMonthlySummaries } from "../monthly-summary/rebuild-monthly-summaries";
import { getAppState } from "../settings/get-app-state";
import { updateAppState } from "../settings/update-app-state";
import { importBackup } from "./import-backup";

export async function syncBackup() {
  const appState = await getAppState();

  if (!appState.cloudProvider || !appState.backupId || !appState.backedAt)
    return;

  const metadata = await getBackupMetadata(appState.backupId);

  if (metadata.modifiedTime > appState.backedAt) {
    const content = await getBackupContent(appState.backupId);
    await importBackup(content);
    await rebuildMonthlySummaries();
  } else {
    await updateBackup(appState.backupId);
  }

  await updateAppState({ backedAt: new Date() });
}
