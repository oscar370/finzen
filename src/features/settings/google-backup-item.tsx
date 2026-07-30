import { authClient } from "#/lib/auth-client";
import { m } from "#/paraglide/messages";
import { syncBackup } from "#/services/backup";
import { updateAppState } from "#/services/settings";
import type { AppState } from "#/types/app-state";
import { ChevronRight, RotateCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmLogoutModal } from "./confirm-logout-modal";

type GoogleBackupItemProps = {
  provider: AppState["cloudProvider"];
  backedAt: AppState["backedAt"];
};

export function GoogleBackupItem({ provider, backedAt }: GoogleBackupItemProps) {
  const [isPending, setIsPending] = useState(false);

  async function handleGoogleSignin() {
    setIsPending(true);
    try {
      await updateAppState({ cloudProvider: "google" });
      await authClient.signIn.social({
        provider: "google",
        scopes: ["https://www.googleapis.com/auth/drive.appdata"],
        callbackURL: "/app/settings?action=sync-drive",
      });
    } catch (error) {
      console.error(error);
      toast.error(m["errors.unexpected"]());
    } finally {
      setIsPending(false);
    }
  }

  async function handleForceSync() {
    setIsPending(true);

    try {
      await syncBackup();
      toast.success("Sincronización forzada con éxito");
    } catch (error) {
      console.error(error);
      toast.error(m["errors.unexpected"]());
    } finally {
      setIsPending(false);
    }
  }

  if (!provider)
    return (
      <li>
        <button
          className="list-row w-full cursor-pointer items-center"
          disabled={isPending}
          onClick={handleGoogleSignin}
        >
          <span className="list-col-grow text-start">Setup backup with Google</span>

          {isPending ? <span className="loading loading-spinner"></span> : <ChevronRight />}
        </button>
      </li>
    );

  return (
    <>
      <li>
        <div className="list-row w-full items-center">
          <span className="list-col-grow text-start">Last backed up</span>

          {`${backedAt?.toLocaleTimeString()} ${backedAt?.toLocaleDateString()}`}
        </div>
      </li>

      <li>
        <button
          className="list-row w-full cursor-pointer items-center"
          disabled={isPending}
          onClick={handleForceSync}
        >
          <span className="list-col-grow text-start">Force sync</span>

          {isPending ? <span className="loading loading-spinner"></span> : <RotateCw />}
        </button>
      </li>

      <ConfirmLogoutModal />
    </>
  );
}
