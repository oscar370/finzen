import { getAppState } from "@/services/settings/get-app-state";

export async function getWelcomeData() {
  const appState = await getAppState();

  return { appState };
}
