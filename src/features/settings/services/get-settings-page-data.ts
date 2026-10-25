import { getAppState } from "@/services/settings/get-app-state";

export async function getSettingsPageData() {
  const appState = await getAppState();

  return { appState };
}
