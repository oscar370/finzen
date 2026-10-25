import { authClient } from "@/lib/auth-client";
import { NotAuthenticatedError } from "@/lib/errors/not-authenticated-error";
import { resetDatabase } from "@/test/db-test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAppState } from "../settings/get-app-state";
import { updateAppState } from "../settings/update-app-state";
import { getAccessToken } from "./get-access-token";

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    getAccessToken: vi.fn(),
    signOut: vi.fn(),
  },
}));

describe("getAccessToken", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await resetDatabase();
  });

  it("returns the access token when available", async () => {
    vi.mocked(authClient.getAccessToken).mockResolvedValue({
      data: { accessToken: "access-token" },
      error: null,
    } as never);

    await expect(getAccessToken()).resolves.toBe("access-token");
    expect(authClient.signOut).not.toHaveBeenCalled();
  });

  it("logs out and throws when there is no access token", async () => {
    vi.mocked(authClient.getAccessToken).mockResolvedValue({
      data: null,
      error: { status: 401 },
    } as never);
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

    await expect(getAccessToken()).rejects.toBeInstanceOf(
      NotAuthenticatedError
    );
    expect(authClient.signOut).toHaveBeenCalledOnce();

    const appState = await getAppState();
    expect(appState.cloudProvider).toBeUndefined();
    expect(appState.backupId).toBeUndefined();
    expect(appState.backedAt).toBeUndefined();
    expect(appState.isAppInit).toBe(true);
  });

  it("throws even when signing out fails", async () => {
    vi.mocked(authClient.getAccessToken).mockResolvedValue({
      data: null,
      error: { status: 401 },
    } as never);
    vi.mocked(authClient.signOut).mockRejectedValue(new Error("network error"));

    await expect(getAccessToken()).rejects.toBeInstanceOf(
      NotAuthenticatedError
    );
  });
});
