import { AppLayout } from "#/components/layout/app-layout";
import { authClient } from "#/lib/auth-client";
import { syncBackup } from "#/services/backup";
import { getAppState } from "#/services/settings";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/app/_layout")({
  component: RouteComponent,
  beforeLoad: async () => {
    const [appState, session] = await Promise.all([
      getAppState(),
      (await authClient.getSession()).data,
    ]);

    if (!appState.isAppInit) {
      throw redirect({
        to: "/app/start",
      });
    }

    return {
      appState,
      session,
    };
  },
});

function RouteComponent() {
  useEffect(() => {
    syncBackup();
  }, []);

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
