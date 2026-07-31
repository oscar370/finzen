import { authClient } from "#/lib/auth-client";
import { db } from "#/lib/db";
import type { AppState } from "#/types/app-state";
import type { GoogleDriveBackupMetadata } from "#/types/backup";
import { vGoogleDriveBackupMetadata, vGoogleDriveUploadResponse } from "#/types/backup";
import "dexie-export-import";
import { parse } from "valibot";
import { getAppState, updateAppState } from "./settings";

export async function manualBackup() {
  const blob = await db.export({
    prettyJson: true,
    transform: (table, value, key) => {
      if (table === "app_state") {
        const updatedValue = {
          ...value,
          backedAt: undefined,
          backupId: undefined,
          cloudProvider: undefined,
        };

        return { value: updatedValue, key };
      }

      return { value, key };
    },
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `backup-${db.name}-${new Date().toISOString().split("T")[0]}.json`;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function setupCloudBackup(provider: AppState["cloudProvider"]) {
  const backup = await getBackupMetadataFromGoogleDriveByName();

  if (!backup) {
    const response = await uploadBackupToGoogleDrive();
    await updateAppState({
      cloudProvider: provider,
      backupId: response.id,
      backedAt: new Date(),
      isAppInit: true,
    });
    return;
  }

  const content = await getBackupFromGoogleDriveById(backup.id);
  await db.import(content, { overwriteValues: true });
  await updateAppState({ cloudProvider: provider, backupId: backup.id, backedAt: new Date() });
}

export async function stopBackup() {
  await updateAppState({ cloudProvider: undefined, backupId: undefined, backedAt: undefined });
}

export async function stopAndDeleteBackup() {
  await deleteGoogleDriveBackup();
  await updateAppState({ cloudProvider: undefined, backupId: undefined, backedAt: undefined });
}

export async function syncBackup() {
  const appState = await getAppState();

  if (!appState.cloudProvider || !appState.backupId || !appState.backedAt) return;

  const metadata = await getBackupMetadataFromGoogleDrive(appState.backupId);

  if (metadata.modifiedTime > appState.backedAt) {
    const content = await getBackupFromGoogleDriveById(appState.backupId);
    await db.import(content, { overwriteValues: true });
  } else {
    await updateGoogleDriveBackup();
  }

  await updateAppState({ backedAt: new Date() });
}

async function getBackupMetadataFromGoogleDrive(fileId: string) {
  const { data } = await authClient.getAccessToken({ providerId: "google" });

  if (!data) throw new Error("You are not logged in");

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,modifiedTime`,
    {
      headers: {
        Authorization: `Bearer ${data.accessToken}`,
      },
    },
  );

  if (!response.ok) throw new Error(`Error retrieving metadata: ${response.statusText}`);

  const json = await response.json();

  return parse(vGoogleDriveBackupMetadata, json);
}

async function getBackupMetadataFromGoogleDriveByName() {
  const { data } = await authClient.getAccessToken({ providerId: "google" });
  const q = encodeURIComponent(`name = 'backup-${db.name}.json' and trashed = false`);
  const url = `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${q}&fields=files(id,modifiedTime)`;

  if (!data) throw new Error("You are not logged in");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${data.accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error searching for file: ${response.statusText}`);
  }

  const json = (await response.json()) as { files: GoogleDriveBackupMetadata[] };
  return json.files.length > 0 ? json.files[0] : null;
}

async function getBackupFromGoogleDriveById(id: string) {
  const { data } = await authClient.getAccessToken({ providerId: "google" });

  if (!data) throw new Error("You are not logged in");

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`, {
    headers: {
      Authorization: `Bearer ${data.accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error retrieving content: ${response.statusText}`);
  }

  return await response.blob();
}

async function uploadBackupToGoogleDrive() {
  const [{ data }, blob] = await Promise.all([
    authClient.getAccessToken({ providerId: "google" }),
    db.export({ prettyJson: true }),
  ]);

  if (!data) throw new Error("You are not logged in");

  const metadataResponse = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${data.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `backup-${db.name}.json`,
      parents: ["appDataFolder"],
    }),
  });

  if (!metadataResponse.ok) throw new Error("Error creating file metadata");
  const metadata = await metadataResponse.json();

  const uploadResponse = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files/${metadata.id}?uploadType=media`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${data.accessToken}`,
        "Content-Type": blob.type || "application/json",
      },
      body: blob,
    },
  );

  if (!uploadResponse.ok) throw new Error("Error uploading file content");

  const json = await uploadResponse.json();
  return parse(vGoogleDriveUploadResponse, json);
}

async function updateGoogleDriveBackup() {
  const [{ data }, blob, appState] = await Promise.all([
    authClient.getAccessToken({ providerId: "google" }),
    db.export({
      prettyJson: true,
    }),
    getAppState(),
  ]);

  if (!data) throw new Error("You are not logged in");
  if (!appState.backupId) throw new Error("backupId is required");

  const form = new FormData();
  form.append("file", blob);

  const response = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files/${appState.backupId}?uploadType=media`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${data.accessToken}`,
        "Content-Type": "application/json",
      },
      body: blob,
    },
  );

  if (!response.ok) throw new Error(`Error updating backup: ${response.statusText}`);
}

async function deleteGoogleDriveBackup() {
  const [{ data }, appState] = await Promise.all([
    authClient.getAccessToken({ providerId: "google" }),
    getAppState(),
  ]);

  if (!data) throw new Error("You are not logged in");
  if (!appState.backupId) throw new Error("backupId is required");

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${appState.backupId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${data.accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error deleting backup: ${response.statusText}`);
  }
}
