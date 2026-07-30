import { PageContainer } from "#/components/ui/page-container";
import { AppSettingsList } from "#/features/settings/app-settings-list";
import { BackupList } from "#/features/settings/backup-list";
import { m } from "#/paraglide/messages";
import { setupCloudBackup } from "#/services/backup";
import { getAppState } from "#/services/settings";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import * as v from "valibot";

const vSearchParams = v.object({
  action: v.optional(v.string()),
});

export const Route = createFileRoute("/app/_layout/settings/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    return {
      appState: context.appState,
      session: context.session,
    };
  },
  validateSearch: (search) => v.parse(vSearchParams, search),
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const searchParams = Route.useSearch();
  const appState = useLiveQuery(() => getAppState(), [], data.appState);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.action !== "sync-drive") return;

    handleSetupCloudBackup();

    async function handleSetupCloudBackup() {
      await setupCloudBackup(data.appState.cloudProvider);
      await navigate({ search: undefined });
    }
  }, []);

  return (
    <PageContainer title={m.settings()}>
      <AppSettingsList appState={appState} />

      <section>
        <h2 className="mb-1 ml-0.5 font-bold">{m.backups()}</h2>
        <BackupList provider={appState.cloudProvider} backedAt={appState.backedAt} />
        {!appState.cloudProvider && (
          <div role="alert" className="alert alert-warning mt-2">
            <AlertTriangle className="size-4" />
            <span>
              Warning: If you have a previous backup in the cloud, it will take precedence when you
              re-link it, replacing the local data.
            </span>
          </div>
        )}
      </section>
    </PageContainer>
  );
}
