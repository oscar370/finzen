import type { AppState } from "@/types/app-state/app-state";
import { getBackupContent } from "../google-drive/get-backup-content";
import { getBackupMetadataByName } from "../google-drive/get-backup-metadata-by-name";
import { uploadBackup } from "../google-drive/upload-backup";
import { rebuildMonthlySummaries } from "../monthly-summary/rebuild-monthly-summaries";
import { updateAppState } from "../settings/update-app-state";
import { importBackup } from "./import-backup";

export async function setupCloudBackup(provider: AppState["cloudProvider"]) {
  const backup = await getBackupMetadataByName();

  if (!backup) {
    const uploaded = await uploadBackup();
    await updateAppState({
      cloudProvider: provider ?? "google",
      backupId: uploaded.id,
      backedAt: new Date(),
      isAppInit: true,
    });
    return;
  }

  const content = await getBackupContent(backup.id);
  await importBackup(content);
  await rebuildMonthlySummaries();
  await updateAppState({
    cloudProvider: provider ?? "google",
    backupId: backup.id,
    backedAt: new Date(),
    isAppInit: true,
  });
}
