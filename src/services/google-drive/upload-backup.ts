import { BackupFailedError } from "@/lib/errors/backup-failed-error";
import { db } from "@/lib/dexie/db";
import {
  vGoogleDriveUploadResponse,
  type GoogleDriveUploadResponse,
} from "@/types/backup/backup-metadata";
import { parse } from "valibot";
import { getAccessToken } from "./get-access-token";

export async function uploadBackup(): Promise<GoogleDriveUploadResponse> {
  const [accessToken, blob] = await Promise.all([
    getAccessToken(),
    db.export({ prettyJson: true }),
  ]);

  const metadataResponse = await fetch(
    "https://www.googleapis.com/drive/v3/files",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `backup-${db.name}.json`,
        parents: ["appDataFolder"],
      }),
    }
  );

  if (!metadataResponse.ok) throw new BackupFailedError();

  const metadata = await metadataResponse.json();
  const uploadResponse = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files/${metadata.id}?uploadType=media`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": blob.type || "application/json",
      },
      body: blob,
    }
  );

  if (!uploadResponse.ok) throw new BackupFailedError();

  return parse(vGoogleDriveUploadResponse, await uploadResponse.json());
}
