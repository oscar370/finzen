import {
  ListItem,
  ListItemContent,
  ListItemSuffix,
  ListItemTitle,
} from "@/components/list";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { notifyError } from "@/lib/errors/notify-error";
import { m } from "@/paraglide/messages";
import { syncBackupNow } from "@/services/backup/schedule-sync";
import { stopAndDeleteBackup } from "@/services/backup/stop-and-delete-backup";
import type { AppState } from "@/types/app-state/app-state";
import { ChevronRight, RotateCw, Trash } from "lucide-react";
import { useTransition } from "react";
import { LogoutDialog } from "./logout-dialog";

type GoogleBackupItemProps = {
  appState: AppState;
};

export function GoogleBackupItem({ appState }: GoogleBackupItemProps) {
  const [isPending, startTransition] = useTransition();

  function handleGoogleSignIn() {
    startTransition(async () => {
      try {
        await authClient.signIn.social({
          provider: "google",
          scopes: ["https://www.googleapis.com/auth/drive.appdata"],
          callbackURL: "/sync?redirect=/app/settings",
        });
      } catch (error) {
        notifyError(error);
      }
    });
  }

  function handleForceSync() {
    startTransition(async () => {
      try {
        await syncBackupNow();
        toast.add({
          description: m.successes_backup_synced(),
          type: "success",
        });
      } catch (error) {
        notifyError(error);
      }
    });
  }

  function handleDeleteCloudBackup() {
    startTransition(async () => {
      try {
        await stopAndDeleteBackup();
        toast.add({
          description: m.successes_backup_deleted(),
          type: "success",
        });
      } catch (error) {
        notifyError(error);
      }
    });
  }

  if (!appState.cloudProvider) {
    return (
      <ListItem
        render={<button type="button" disabled={isPending} />}
        onClick={handleGoogleSignIn}
        aria-disabled={isPending}
      >
        <ListItemContent>
          <ListItemTitle>{m.setup_google_backup()}</ListItemTitle>
        </ListItemContent>
        <ListItemSuffix>
          {isPending ? <Spinner /> : <ChevronRight />}
        </ListItemSuffix>
      </ListItem>
    );
  }

  return (
    <>
      <ListItem>
        <ListItemContent>
          <ListItemTitle>{m.last_backed_up()}</ListItemTitle>
        </ListItemContent>
        <ListItemSuffix>
          {appState.backedAt?.toLocaleString(appState.regionalFormat) ?? "-"}
        </ListItemSuffix>
      </ListItem>

      <ListItem
        render={<button type="button" disabled={isPending} />}
        onClick={handleForceSync}
        aria-disabled={isPending}
      >
        <ListItemContent>
          <ListItemTitle>{m.force_sync()}</ListItemTitle>
        </ListItemContent>
        <ListItemSuffix>
          {isPending ? <Spinner /> : <RotateCw />}
        </ListItemSuffix>
      </ListItem>

      <ListItem>
        <ListItemContent>
          <ListItemTitle>{m.logout()}</ListItemTitle>
        </ListItemContent>
        <ListItemSuffix>
          <LogoutDialog />
        </ListItemSuffix>
      </ListItem>

      {import.meta.env.DEV && (
        <ListItem
          render={<button type="button" disabled={isPending} />}
          onClick={handleDeleteCloudBackup}
          aria-disabled={isPending}
        >
          <ListItemContent>
            <ListItemTitle>{m.delete_cloud_backup()}</ListItemTitle>
          </ListItemContent>
          <ListItemSuffix>{isPending ? <Spinner /> : <Trash />}</ListItemSuffix>
        </ListItem>
      )}
    </>
  );
}
