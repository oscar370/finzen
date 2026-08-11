import { m } from "#/paraglide/messages";
import { manualBackup } from "#/services/backup";
import type { AppState } from "#/types/app-state";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GoogleBackupItem } from "./google-backup-item";

type BackupListProps = {
  provider: AppState["cloudProvider"];
  backedAt: AppState["backedAt"];
};

export function BackupList({ provider, backedAt }: BackupListProps) {
  const [isPending, setIsPending] = useState(false);

  async function handleManualBackup() {
    try {
      setIsPending(true);
      await manualBackup();
    } catch (error) {
      console.error(error);
      toast.error(m["errors.unexpected"]());
    } finally {
      setIsPending(false);
    }
  }

  return (
    <ul className="list rounded-box bg-base-200">
      <li>
        <button
          className="list-row w-full cursor-pointer items-center"
          aria-label={m.download()}
          disabled={isPending}
          onClick={handleManualBackup}
        >
          <span className="list-col-grow text-start">{m.manual_backup()}</span>

          {isPending ? <span className="loading-spinner"></span> : <Download />}
        </button>
      </li>

      <GoogleBackupItem provider={provider} backedAt={backedAt} />
    </ul>
  );
}
