import { m } from "#/paraglide/messages";
import { manualBackup } from "#/services/backup";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function BackupList() {
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

          {isPending ? <span className="loading-spinner" /> : <Download />}
        </button>
      </li>
    </ul>
  );
}
