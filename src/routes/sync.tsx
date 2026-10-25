import { SyncDriveView } from "@/features/backup/components/sync-drive-view";
import { createFileRoute } from "@tanstack/react-router";

type SyncSearch = { redirect: "/app" | "/app/settings" };

export const Route = createFileRoute("/sync")({
  component: RouteComponent,
  ssr: false,
  validateSearch: (search: Record<string, unknown>): SyncSearch => ({
    redirect: search.redirect === "/app/settings" ? "/app/settings" : "/app",
  }),
});

function RouteComponent() {
  const { redirect } = Route.useSearch();

  return <SyncDriveView redirect={redirect} />;
}
