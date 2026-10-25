import { authClient } from "@/lib/auth-client";
import { resetDatabase } from "@/test/db-test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAppState } from "../settings/get-app-state";
import { updateAppState } from "../settings/update-app-state";
import { logout } from "./logout";

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signOut: vi.fn(),
  },
}));

describe("logout", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await resetDatabase();
  });

  it("clears the cloud auth state and signs out", async () => {
    vi.mocked(authClient.signOut).mockResolvedValue({
      data: null,
      error: null,
    } as never);
    await updateAppState({
      cloudProvider: "google",
      backupId: "backup-id",
      backedAt: new Date(),
      isAppInit: true,
    });

    await logout();

    expect(authClient.signOut).toHaveBeenCalledOnce();

    const appState = await getAppState();
    expect(appState.cloudProvider).toBeUndefined();
    expect(appState.backupId).toBeUndefined();
    expect(appState.backedAt).toBeUndefined();
    expect(appState.isAppInit).toBe(true);
  });
});
