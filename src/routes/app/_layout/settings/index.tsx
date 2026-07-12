import { PageContainer } from "#/components/ui/page-container";
import { AppSettingsList } from "#/features/settings/app-settings-list";
import { BackupList } from "#/features/settings/backup-list";
import { m } from "#/paraglide/messages";
import { getAppState } from "#/services/settings";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

export const Route = createFileRoute("/app/_layout/settings/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    return {
      appState: context.appState,
    };
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const appState = useLiveQuery(() => getAppState(), [], data.appState);

  return (
    <PageContainer title={m.settings()}>
      <AppSettingsList appState={appState} />

      <section>
        <h2 className="mb-1 ml-0.5 font-bold">{m.backups()}</h2>
        <BackupList />
      </section>
    </PageContainer>
  );
}
