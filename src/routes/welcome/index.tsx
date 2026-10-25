import { GoogleDriveButton } from "@/features/onboarding/components/google-drive-button";
import { RestoreLocalButton } from "@/features/onboarding/components/restore-local-button";
import { WelcomeForm } from "@/features/onboarding/components/welcome-form";
import { WelcomeNav } from "@/features/onboarding/components/welcome-nav";
import { getWelcomeData } from "@/features/onboarding/services/get-welcome-data";
import { currentYearMonth } from "@/lib/utils/current-year-month";
import { m } from "@/paraglide/messages";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/welcome/")({
  component: RouteComponent,
  ssr: false,
  beforeLoad: async () => {
    const { appState } = await getWelcomeData();

    if (appState.isAppInit) {
      throw redirect({
        to: "/app",
        search: { yearMonth: currentYearMonth() },
      });
    }

    return {
      appState,
    };
  },
});

function RouteComponent() {
  const { appState } = Route.useRouteContext();

  return (
    <div className="flex h-full min-h-svh w-full flex-col">
      <WelcomeNav />

      <main className="flex w-full flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-100">
          <div className="mb-8 text-left">
            <h1 className="text-xl font-bold">{m.welcome_title()}</h1>
            <p>{m.welcome_description()}</p>
          </div>

          <WelcomeForm state={appState} />

          <div className="flex items-center justify-between">
            <p>{m.welcome_or_log_in()}</p>

            <div className="flex gap-0.5">
              <GoogleDriveButton />
              <RestoreLocalButton />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
