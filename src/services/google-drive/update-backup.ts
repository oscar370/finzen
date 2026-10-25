import { BackupFailedError } from "@/lib/errors/backup-failed-error";
import { db } from "@/lib/dexie/db";
import { getAccessToken } from "./get-access-token";

export async function updateBackup(backupId: string) {
  const [accessToken, blob] = await Promise.all([
    getAccessToken(),
    db.export({ prettyJson: true }),
  ]);

  const response = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files/${backupId}?uploadType=media`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: blob,
    }
  );

  if (!response.ok) throw new BackupFailedError();
}
