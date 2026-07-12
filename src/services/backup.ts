import { db } from "#/lib/db";
import "dexie-export-import";

export async function manualBackup() {
  const blob = await db.export({
    prettyJson: true,
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
