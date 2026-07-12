import { AppLayout } from "#/components/layout/app-layout";
import { getAppState } from "#/services/settings";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_layout")({
  component: RouteComponent,
  beforeLoad: async () => {
    const appState = await getAppState();

    if (!appState.isAppInit) {
      throw redirect({
        to: "/app/start",
      });
    }

    return {
      appState,
    };
  },
});

function RouteComponent() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
