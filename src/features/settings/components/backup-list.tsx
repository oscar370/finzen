import {
  List,
  ListItem,
  ListItemContent,
  ListItemSuffix,
  ListItemTitle,
} from "@/components/list";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { notifyError } from "@/lib/errors/notify-error";
import { m } from "@/paraglide/messages";
import { manualBackup } from "@/services/backup/manual-backup";
import type { AppState } from "@/types/app-state/app-state";
import { Download } from "lucide-react";
import { useTransition } from "react";
import { GoogleBackupItem } from "./google-backup-item";

type BackupListProps = {
  appState: AppState;
};

export function BackupList({ appState }: BackupListProps) {
  const [isPending, startTransition] = useTransition();

  function handleManualBackup() {
    startTransition(async () => {
      try {
        await manualBackup();
        toast.add({
          description: m.successes_backup_downloaded(),
          type: "success",
        });
      } catch (error) {
        notifyError(error);
      }
    });
  }

  return (
    <List>
      <ListItem
        render={<button type="button" disabled={isPending} />}
        onClick={handleManualBackup}
        aria-label={m.download()}
        aria-disabled={isPending}
      >
        <ListItemContent>
          <ListItemTitle>{m.manual_backup()}</ListItemTitle>
        </ListItemContent>
        <ListItemSuffix>
          {isPending ? <Spinner /> : <Download />}
        </ListItemSuffix>
      </ListItem>

      <GoogleBackupItem appState={appState} />
    </List>
  );
}
