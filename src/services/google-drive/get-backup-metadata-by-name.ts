import { BackupFailedError } from "@/lib/errors/backup-failed-error";
import { db } from "@/lib/dexie/db";
import {
  vGoogleDriveBackupMetadata,
  type GoogleDriveBackupMetadata,
} from "@/types/backup/backup-metadata";
import * as v from "valibot";
import { getAccessToken } from "./get-access-token";

export async function getBackupMetadataByName(): Promise<GoogleDriveBackupMetadata | null> {
  const accessToken = await getAccessToken();
  const query = encodeURIComponent(
    `name = 'backup-${db.name}.json' and trashed = false`
  );
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${query}&fields=files(id,modifiedTime)`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!response.ok) throw new BackupFailedError();

  return (
    v.parse(
      v.object({ files: v.array(vGoogleDriveBackupMetadata) }),
      await response.json()
    ).files[0] ?? null
  );
}
