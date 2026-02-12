import { db } from "@/lib/dexie";
import { useAppStore } from "@/stores/use-app-store";
import { BackupPayloadSchema, type BackupPayload } from "@/types/backup";
import z from "zod";
import { rebuildAllSummaries } from "./monthly-summary";

// File System Access utilities

export function isFileSystemApiSupported(): boolean {
  return "showOpenFilePicker" in self;
}

export async function verifyPermission(handle: FileSystemFileHandle) {
  const options = { mode: "readwrite" as FileSystemPermissionMode };
  if ((await handle.queryPermission(options)) === "granted") return true;
  if ((await handle.requestPermission(options)) === "granted") return true;
  return false;
}

export async function writeToFileHandle(
  handle: FileSystemFileHandle,
  content: string,
) {
  try {
    const isAllowed = await verifyPermission(handle);
    if (!isAllowed) return false;

    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();

    return { ok: true };
  } catch (error) {
    console.error("FileSystem API Write failed:", error);
    return { ok: false };
  }
}

export async function setupFileSystemHandle() {
  try {
    if (!isFileSystemApiSupported())
      throw new Error("The system does not support File System API");

    const handle = await window.showSaveFilePicker({
      suggestedName: "finzen_backup.json",
      types: [
        { description: "JSON File", accept: { "application/json": [".json"] } },
      ],
    });

    await db.backup.put({
      id: "backup_config",
      fileHandle: handle,
      lastBackupAt: Date.now(),
    });

    return { ok: true };
  } catch (error) {
    console.error("User cancelled or failed to pick file:", error);
    return { ok: false };
  }
}

// Perform backup

export function generateBackupFilename(): string {
  const date = new Date().toISOString().split("T")[0];
  return `finzen_backup_${date}.json`;
}

export function triggerFileDownload(filename: string, payload: object) {
  try {
    const jsonString = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { ok: true };
  } catch (error) {
    console.error("Failed to trigger file download:", error);
    return { ok: false };
  }
}

export async function gatherBackupData() {
  try {
    const [accounts, categories, transactions, budgets] = await Promise.all([
      db.accounts.toArray(),
      db.categories.toArray(),
      db.transactions.toArray(),
      db.budget.toArray(),
    ]);

    return {
      accounts,
      categories,
      transactions,
      budgets,
    };
  } catch (error) {
    console.error("Failed to gather data from database:", error);
    return null;
  }
}

export async function handleManualBackup() {
  try {
    const data = await gatherBackupData();
    if (!data) throw new Error("Could not gather database data");

    const payload: BackupPayload = {
      metadata: {
        version: 1,
        createdAt: Date.now(),
        appVersion: "1.0.0",
      },
      data,
    };

    const filename = generateBackupFilename();
    const result = triggerFileDownload(filename, payload);

    if (!result) throw new Error("Failed to trigger browser download");

    return { ok: true };
  } catch (error) {
    console.error("Manual download action failed:", error);
    return { ok: false };
  }
}

export async function performLocalBackup() {
  try {
    const data = await gatherBackupData();
    if (!data) return false;

    const payload: BackupPayload = {
      metadata: { version: 1, createdAt: Date.now(), appVersion: "1.0.0" },
      data,
    };
    const jsonString = JSON.stringify(payload, null, 2);

    if (isFileSystemApiSupported()) {
      const config = await db.backup.get("backup_config");

      if (config?.fileHandle) {
        const result = await writeToFileHandle(config.fileHandle, jsonString);
        if (result && result.ok) {
          await db.backup.update("backup_config", { lastBackupAt: Date.now() });
          return { ok: true };
        }
      }
    }

    const filename = generateBackupFilename();
    return triggerFileDownload(filename, payload);
  } catch (error) {
    console.error("Backup workflow failed:", error);
    return { ok: false };
  }
}

// Restore backup

export async function parseBackupFile(file: File) {
  try {
    const text = await file.text();
    const json = JSON.parse(text);

    const result = BackupPayloadSchema.safeParse(json);

    if (!result.success) {
      console.error("Backup validation failed:", z.treeifyError(result.error));
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("Failed to parse backup file:", error);
    return null;
  }
}

export async function injectBackupData(payload: BackupPayload) {
  try {
    const { accounts, categories, transactions, budgets } = payload.data;

    await db.transaction(
      "rw",
      [
        db.accounts,
        db.categories,
        db.transactions,
        db.budget,
        db.monthly_summaries,
      ],
      async () => {
        await Promise.all([
          db.accounts.clear(),
          db.categories.clear(),
          db.transactions.clear(),
          db.budget.clear(),
          db.monthly_summaries.clear(),
        ]);

        await Promise.all([
          db.accounts.bulkAdd(accounts),
          db.categories.bulkAdd(categories),
          db.transactions.bulkAdd(transactions),
          db.budget.bulkAdd(budgets),
        ]);

        await rebuildAllSummaries();
      },
    );

    return { ok: true };
  } catch (error) {
    console.error("Database injection failed:", error);
    return { ok: false };
  }
}

export async function handleManualRestore(file: File) {
  try {
    const result = await restoreLocalBackup(file);

    if (!result.ok) {
      throw new Error("The restore process could not be completed.");
    }

    return { ok: true };
  } catch (error) {
    console.error("Manual restore trigger failed:", error);
    return { ok: false };
  }
}

export async function restoreLocalBackup(file: File) {
  try {
    const payload = await parseBackupFile(file);

    if (!payload) {
      throw new Error("Invalid file format or structure");
    }

    const result = await injectBackupData(payload);

    if (!result) {
      throw new Error("Database write operation failed");
    }

    return { ok: true };
  } catch (error) {
    console.error("Restore workflow failed:", error);
    return { ok: false };
  }
}

// Manager

export async function syncWithDiskSource() {
  try {
    const config = await db.backup.get("backup_config");
    if (!config?.fileHandle) throw new Error("No file handle configured");

    const isAllowed = await verifyPermission(config.fileHandle);
    if (!isAllowed) throw new Error("Permission denied for file handle");

    const file = await config.fileHandle.getFile();
    const diskPayload = await parseBackupFile(file);

    if (!diskPayload) {
      await performLocalBackup();
      return { ok: true };
    }

    const lastBackupAt = config.lastBackupAt || 0;
    const diskCreatedAt = diskPayload.metadata.createdAt;

    if (diskCreatedAt > lastBackupAt) {
      const restoreResult = await restoreLocalBackup(file);
      if (!restoreResult)
        throw new Error("Failed to restore newer disk backup");
    } else {
      const backupResult = await performLocalBackup();
      if (!backupResult)
        throw new Error("Failed to update disk with local data");
    }

    return { ok: true };
  } catch (error) {
    console.error("Sync cycle failed:", error);
    return { ok: false };
  }
}

export function getSafeInterval(ms: number): number {
  return Math.max(ms, 5 * 60 * 1000);
}

export async function executeForceSync() {
  try {
    const canUseSystemApi = isFileSystemApiSupported();
    const config = await db.backup.get("backup_config");

    if (canUseSystemApi && config?.fileHandle) {
      const result = await syncWithDiskSource();
      if (!result.ok) throw new Error("Disk sync failed");
    } else {
      const result = await performLocalBackup();
      if (!result) throw new Error("Fallback backup failed");
    }

    return { ok: true };
  } catch (error) {
    console.error("Force sync action failed:", error);
    return { ok: false };
  }
}

export async function initializeBackup() {
  try {
    const { isAutoBackupEnabled, backupInterval } = useAppStore.getState();

    if (!isAutoBackupEnabled || !isFileSystemApiSupported()) {
      return { ok: true };
    }

    await syncWithDiskSource();

    const safeInterval = getSafeInterval(backupInterval);

    setInterval(async () => {
      const { isAutoBackupEnabled: stillEnabled } = useAppStore.getState();
      if (stillEnabled) {
        await syncWithDiskSource();
      }
    }, safeInterval);

    return { ok: true };
  } catch (error) {
    console.error("Automation initialization failed:", error);
    return { ok: false };
  }
}

// Utilities

export async function getBackupLocationInfo() {
  try {
    const config = await db.backup.get("backup_config");

    if (!config) {
      return null;
    }

    return {
      lastBackupAt: config.lastBackupAt,
    };
  } catch (error) {
    console.error("Error getting backup info:", error);
    return null;
  }
}
