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
      <li className="list-row items-center">
        <span className="list-col-grow">{m.manual_backup()}</span>
        <button
          className="btn bg-ghost btn-sm btn-square"
          aria-label={m.download()}
          disabled={isPending}
          onClick={handleManualBackup}
        >
          {isPending ? <span className="loading-spinner" /> : <Download />}
        </button>
      </li>
    </ul>
  );
}
