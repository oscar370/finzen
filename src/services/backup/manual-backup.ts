import { db } from "@/lib/dexie/db";
import "dexie-export-import";

export async function manualBackup() {
  const blob = await db.export({
    prettyJson: true,
    transform: (table, value, key) => {
      if (table === "app_state") {
        return {
          value: {
            ...value,
            backedAt: undefined,
            backupId: undefined,
            cloudProvider: undefined,
          },
          key,
        };
      }

      return { value, key };
    },
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `backup-${db.name}-${new Date().toISOString().split("T")[0]}.json`;

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
