import { db } from "@/lib/dexie/db";
import "dexie-export-import";

export async function importBackup(content: Blob) {
  await db.import(content, {
    overwriteValues: true,
    acceptVersionDiff: true,
  });
}
