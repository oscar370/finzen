import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cancelScheduledSync,
  configureBackupSync,
  flushBackupSync,
  scheduleBackupSync,
  syncBackupNow,
} from "./schedule-sync";

describe("backup sync scheduler", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    configureBackupSync(null);
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("debounces multiple sync requests into one run", async () => {
    const sync = vi.fn().mockResolvedValue(undefined);
    configureBackupSync({ sync });

    scheduleBackupSync();
    scheduleBackupSync();
    scheduleBackupSync();

    expect(sync).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1_000);

    expect(sync).toHaveBeenCalledOnce();
  });

  it("runs again when a mutation happens during an in-flight sync", async () => {
    let resolveFirstSync!: () => void;
    let calls = 0;
    const sync = vi.fn(async () => {
      calls += 1;

      if (calls === 1) {
        await new Promise<void>((resolve) => {
          resolveFirstSync = resolve;
        });
      }
    });
    configureBackupSync({ sync });

    scheduleBackupSync();
    await vi.advanceTimersByTimeAsync(1_000);
    expect(sync).toHaveBeenCalledOnce();

    scheduleBackupSync();
    await vi.advanceTimersByTimeAsync(1_000);
    expect(sync).toHaveBeenCalledOnce();

    resolveFirstSync();
    await vi.advanceTimersByTimeAsync(0);

    expect(sync).toHaveBeenCalledTimes(2);
  });

  it("flushes a scheduled sync immediately", async () => {
    const sync = vi.fn().mockResolvedValue(undefined);
    configureBackupSync({ sync });

    scheduleBackupSync();
    await flushBackupSync();

    expect(sync).toHaveBeenCalledOnce();

    await vi.advanceTimersByTimeAsync(1_000);
    expect(sync).toHaveBeenCalledOnce();
  });

  it("cancels a scheduled sync", async () => {
    const sync = vi.fn().mockResolvedValue(undefined);
    configureBackupSync({ sync });

    scheduleBackupSync();
    cancelScheduledSync();

    await vi.advanceTimersByTimeAsync(1_000);

    expect(sync).not.toHaveBeenCalled();
  });

  it("waits for an in-flight sync before running a manual sync", async () => {
    let resolveFirstSync!: () => void;
    let calls = 0;
    const sync = vi.fn(async () => {
      calls += 1;

      if (calls === 1) {
        await new Promise<void>((resolve) => {
          resolveFirstSync = resolve;
        });
      }
    });
    configureBackupSync({ sync });

    scheduleBackupSync();
    await vi.advanceTimersByTimeAsync(1_000);

    const manualSync = syncBackupNow();
    resolveFirstSync();
    await manualSync;

    expect(sync).toHaveBeenCalledTimes(2);
  });

  it("propagates errors from a manual sync", async () => {
    const sync = vi.fn().mockRejectedValue(new Error("sync failed"));
    configureBackupSync({ sync });

    await expect(syncBackupNow()).rejects.toThrow("sync failed");
  });

  it("does not sync while offline", async () => {
    vi.stubGlobal("navigator", { onLine: false });
    const sync = vi.fn().mockResolvedValue(undefined);
    configureBackupSync({ sync });

    scheduleBackupSync();
    await vi.advanceTimersByTimeAsync(1_000);

    expect(sync).not.toHaveBeenCalled();
  });

  it("does nothing when no runner is configured", async () => {
    configureBackupSync(null);

    scheduleBackupSync();
    await vi.advanceTimersByTimeAsync(1_000);

    expect(vi.getTimerCount()).toBe(0);
  });
});
