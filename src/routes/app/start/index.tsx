import { NumberInput, Select } from "#/components/ui/form";
import { authClient } from "#/lib/auth-client";
import { CURRENCIES, LANGUAGES } from "#/lib/constants";
import { db } from "#/lib/db";
import { m } from "#/paraglide/messages";
import { getLocale, setLocale } from "#/paraglide/runtime";
import { setupCloudBackup } from "#/services/backup";
import { getAppState, updateAppState } from "#/services/settings";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as v from "valibot";

const vSearchParams = v.object({
  action: v.optional(v.string()),
});

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
  validateSearch: (search) => v.parse(vSearchParams, search),
});

function RouteComponent() {
  const data = Route.useRouteContext();
  const navigate = useNavigate();
  const searchParams = Route.useSearch();
  const appState = useLiveQuery(() => getAppState(), [], data.appState);
  const [isPending, setIsPending] = useState(false);

  const handleInit = () => {
    updateAppState({ isAppInit: true });
    navigate({ to: "/app", replace: true });
  };

  async function handleRestoreLocalBackup(e: ChangeEvent<HTMLInputElement>) {
    setIsPending(true);
    try {
      const { files } = e.currentTarget;
      if (!files) return;
      const file = files[0];
      await db.import(file, { overwriteValues: true });
      await navigate({ to: "/app", replace: true });
    } catch (error) {
      console.error(error);
      toast.error(m["errors.unexpected"]());
    } finally {
      setIsPending(false);
    }
  }

  async function handleGoogleSignin() {
    setIsPending(true);
    try {
      await updateAppState({ cloudProvider: "google" });
      await authClient.signIn.social({
        provider: "google",
        scopes: ["https://www.googleapis.com/auth/drive.appdata"],
        callbackURL: "/app/start?action=sync-drive",
      });
    } catch (error) {
      console.error(error);
      toast.error(m["errors.unexpected"]());
    } finally {
      setIsPending(false);
    }
  }

  useEffect(() => {
    if (searchParams.action !== "sync-drive") return;

    handleSetupCloudBackup();

    async function handleSetupCloudBackup() {
      await setupCloudBackup(data.appState.cloudProvider);
      await navigate({ to: "/app", replace: true });
    }
  }, []);

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
          {m.continue()}
        </button>

        <div className="mt-4 w-full max-w-100">
          <p className="text-center">{m["start.second_description"]()}</p>
          <div className="mt-1 flex w-full items-start justify-start gap-2">
            <label className="btn has-disabled:btn-disabled btn-neutral">
              <span>{m.restore_local_backup()}</span>

              <input
                className="sr-only"
                type="file"
                disabled={isPending}
                onChange={handleRestoreLocalBackup}
              />
            </label>
            <button
              className="btn border-[#e5e5e5] bg-white text-black"
              disabled={isPending}
              onClick={handleGoogleSignin}
            >
              <svg
                aria-label="Google logo"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <g>
                  <path d="m0 0H512V512H0" fill="#fff"></path>
                  <path
                    fill="#34a853"
                    d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                  ></path>
                  <path
                    fill="#4285f4"
                    d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                  ></path>
                  <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
                  <path
                    fill="#ea4335"
                    d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                  ></path>
                </g>
              </svg>
              {m["login.google"]()}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
