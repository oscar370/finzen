type BackupSyncOptions = {
  sync: () => Promise<void>;
  onError?: (error: unknown) => void;
};

const SYNC_DEBOUNCE_MS = 1_000;

let runner: (() => Promise<void>) | null = null;
let errorHandler: (error: unknown) => void = console.error;
let timer: ReturnType<typeof setTimeout> | undefined;
let running: Promise<void> | null = null;
let dirty = false;
let listeningForOnline = false;

export function configureBackupSync(options: BackupSyncOptions | null) {
  runner = options?.sync ?? null;
  errorHandler = options?.onError ?? console.error;

  if (!runner) {
    cancelScheduledSync();
    return;
  }

  listenForOnline();
}

export function scheduleBackupSync() {
  if (!runner) return;

  dirty = true;

  if (!isOnline()) return;

  clearTimer();
  timer = setTimeout(() => {
    timer = undefined;

    if (dirty) void runSafely();
  }, SYNC_DEBOUNCE_MS);
}

export async function flushBackupSync() {
  if (!runner) return;

  clearTimer();
  dirty = true;

  await runSafely();
}

export async function syncBackupNow() {
  if (!runner) return;

  clearTimer();
  dirty = true;

  if (running) await running;

  const runSync = runner;
  let syncError: unknown;

  running = (async () => {
    while (dirty) {
      dirty = false;

      try {
        await runSync();
      } catch (error) {
        syncError = error;
        return;
      }
    }
  })();

  try {
    await running;
  } finally {
    running = null;
  }

  if (syncError) throw syncError;
}

export function cancelScheduledSync() {
  clearTimer();
  dirty = false;
}

async function runSafely() {
  if (!runner) return;

  if (running) {
    await running;
    return;
  }

  const runSync = runner;

  running = (async () => {
    while (dirty && isOnline()) {
      dirty = false;

      try {
        await runSync();
      } catch (error) {
        errorHandler(error);
      }
    }
  })();

  try {
    await running;
  } finally {
    running = null;
  }
}

function clearTimer() {
  if (!timer) return;

  clearTimeout(timer);
  timer = undefined;
}

function isOnline() {
  return typeof navigator === "undefined" || navigator.onLine !== false;
}

function listenForOnline() {
  if (listeningForOnline || typeof window === "undefined") return;

  listeningForOnline = true;
  window.addEventListener("online", () => {
    if (dirty) scheduleBackupSync();
  });
}
