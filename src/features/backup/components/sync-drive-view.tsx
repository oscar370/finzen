import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { notifyError } from "@/lib/errors/notify-error";
import { currentYearMonth } from "@/lib/utils/current-year-month";
import { m } from "@/paraglide/messages";
import { setupCloudBackup } from "@/services/backup/setup-cloud-backup";
import { getAppState } from "@/services/settings/get-app-state";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

type SyncDriveViewProps = {
  redirect: "/app" | "/app/settings";
};

export function SyncDriveView({ redirect }: SyncDriveViewProps) {
  const navigate = useNavigate();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function run() {
      try {
        const appState = await getAppState();
        await setupCloudBackup(appState.cloudProvider);
        toast.add({
          description: m.successes_cloud_backup_setup(),
          type: "success",
        });
      } catch (error) {
        notifyError(error);
      }

      if (redirect === "/app/settings") {
        await navigate({ to: "/app/settings", replace: true });
        return;
      }

      await navigate({
        to: "/app",
        search: { yearMonth: currentYearMonth() },
        replace: true,
      });
    }

    void run();
  }, [navigate, redirect]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-2">
      <h1 className="flex items-center gap-2 text-lg font-bold">
        {m.start_syncing()}
        <Spinner />
      </h1>
    </main>
  );
}
