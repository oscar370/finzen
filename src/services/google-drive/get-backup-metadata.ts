import { BackupFailedError } from "@/lib/errors/backup-failed-error";
import {
  vGoogleDriveBackupMetadata,
  type GoogleDriveBackupMetadata,
} from "@/types/backup/backup-metadata";
import { parse } from "valibot";
import { getAccessToken } from "./get-access-token";

export async function getBackupMetadata(
  fileId: string
): Promise<GoogleDriveBackupMetadata> {
  const accessToken = await getAccessToken();
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,modifiedTime`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) throw new BackupFailedError();

  return parse(vGoogleDriveBackupMetadata, await response.json());
}
