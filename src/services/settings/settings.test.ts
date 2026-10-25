import { db } from "@/lib/dexie/db";
import { AppStateNotFoundError } from "@/lib/errors/app-state-not-found-error";
import { resetDatabase } from "@/test/db-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { getAppState } from "./get-app-state";
import { updateAppState } from "./update-app-state";
import { updateBalance } from "./update-balance";

describe("settings services", () => {
  beforeEach(resetDatabase);

  it("returns the seeded app state", async () => {
    await expect(getAppState()).resolves.toMatchObject({
      id: 0,
      balance: 0,
      currency: "USD",
      isAppInit: false,
      regionalFormat: "en-US",
    });
  });

  it("throws when the app state is missing", async () => {
    await db.app_state.clear();

    await expect(getAppState()).rejects.toBeInstanceOf(AppStateNotFoundError);
  });

  it("updates app state fields partially", async () => {
    await updateAppState({ balance: 500, currency: "EUR" });

    await expect(getAppState()).resolves.toMatchObject({
      balance: 500,
      currency: "EUR",
      regionalFormat: "en-US",
    });
  });

  it("adds and removes income from the stored balance", async () => {
    const transaction = { amount: 150.25, kind: "income" as const };

    await updateBalance(transaction, "add");
    await expect(getAppState()).resolves.toMatchObject({ balance: 150.25 });

    await updateBalance(transaction, "remove");
    await expect(getAppState()).resolves.toMatchObject({ balance: 0 });
  });

  it("adds and removes expenses from the stored balance", async () => {
    const transaction = { amount: 40.5, kind: "expense" as const };

    await updateBalance(transaction, "add");
    await expect(getAppState()).resolves.toMatchObject({ balance: -40.5 });

    await updateBalance(transaction, "remove");
    await expect(getAppState()).resolves.toMatchObject({ balance: 0 });
  });

  it("rounds the persisted balance to two decimals", async () => {
    await updateAppState({ balance: 0.1 });

    await updateBalance({ amount: 0.2, kind: "income" }, "add");

    await expect(getAppState()).resolves.toMatchObject({ balance: 0.3 });
  });
});
