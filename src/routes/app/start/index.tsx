import { NumberInput, Select } from "#/components/ui/form";
import { CURRENCIES, LANGUAGES } from "#/lib/constants";
import { m } from "#/paraglide/messages";
import { getLocale, setLocale } from "#/paraglide/runtime";
import { getAppState, updateAppState } from "#/services/settings";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

export const Route = createFileRoute("/app/start/")({
  component: RouteComponent,
  beforeLoad: async () => {
    const appState = await getAppState();

    if (appState.isAppInit) {
      throw redirect({
        to: "/app",
      });
    }

    return {
      appState,
    };
  },
});

function RouteComponent() {
  const data = Route.useRouteContext();
  const navigate = useNavigate();
  const appState = useLiveQuery(() => getAppState(), [], data.appState);

  const handleInit = () => {
    updateAppState({ isAppInit: true });
    navigate({ to: "/app" });
  };

  return (
    <main className="mx-auto h-full w-full max-w-150 px-1">
      <div className="flex h-dvh w-full flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-bold">{m["start.title"]()}</h1>
        <p className="text-center">{m["start.description"]()}</p>

        <div className="grid w-full max-w-100 grid-cols-1 md:grid-cols-2">
          <div className="md:mr-2">
            <Select
              name="language"
              label={m.language()}
              value={getLocale()}
              onChange={(value) => setLocale(value)}
            >
              {LANGUAGES.map((language) => (
                <option key={language.value} value={language.value}>
                  {language.label}
                </option>
              ))}
            </Select>
          </div>

          <Select
            name="currency"
            label={m.currency()}
            value={appState.currency}
            onChange={(value) => updateAppState({ currency: value })}
          >
            {CURRENCIES.map((currency) => (
              <option key={currency.value} value={currency.value}>
                {currency.label}
              </option>
            ))}
          </Select>

          <div className="mx-auto w-full md:col-[1/4] md:mt-2">
            <NumberInput
              name="balance"
              label={m.balance()}
              value={appState.balance}
              onChange={(value) => updateAppState({ balance: value ? Number(value) : 0 })}
            />
          </div>
        </div>

        <button className="btn btn-primary mt-2 min-w-30" onClick={handleInit}>
          {m["start.btn"]()}
        </button>
      </div>
    </main>
  );
}
