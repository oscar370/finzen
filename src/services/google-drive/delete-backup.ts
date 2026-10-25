import { BackupFailedError } from "@/lib/errors/backup-failed-error";
import { getAccessToken } from "./get-access-token";

export async function deleteBackup(backupId: string) {
  const accessToken = await getAccessToken();
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${backupId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) throw new BackupFailedError();
}
