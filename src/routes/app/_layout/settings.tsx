import {
  PageContainer,
  PageContainerContent,
  PageContainerHeader,
  PageContainerTittle,
} from "@/components/page-container";
import { Section, SectionTitle } from "@/components/section";
import { BackupList } from "@/features/settings/components/backup-list";
import { SettingsList } from "@/features/settings/components/settings-list";
import { getSettingsPageData } from "@/features/settings/services/get-settings-page-data";
import { m } from "@/paraglide/messages";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/app/_layout/settings")({
  component: RouteComponent,
  loader: async () => getSettingsPageData(),
});

function RouteComponent() {
  const { appState } = useLiveQuery(
    () => getSettingsPageData(),
    [],
    Route.useLoaderData()
  );

  return (
    <PageContainer>
      <PageContainerHeader>
        <PageContainerTittle>{m.settings()}</PageContainerTittle>
      </PageContainerHeader>

      <PageContainerContent>
        <Section>
          <SettingsList appState={appState} />
        </Section>

        <Section>
          <SectionTitle>{m.backups()}</SectionTitle>

          <BackupList appState={appState} />

          {!appState.cloudProvider && (
            <div
              role="alert"
              className="mt-2 flex items-start gap-2 rounded-2xl bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400"
            >
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>{m.warnings_cloud_backup()}</span>
            </div>
          )}
        </Section>
      </PageContainerContent>
    </PageContainer>
  );
}
