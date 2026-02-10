import { db } from "@/lib/dexie";
import type { Account, DraftAccount } from "@/types/accounts";

import type { Transaction } from "@/types/transactions";
import { useLiveQuery } from "dexie-react-hooks";
import { t } from "i18next";
import { syncMonthlySummary } from "./monthly-summary";

export async function addAccount(draftAccount: DraftAccount) {
  const accountId = crypto.randomUUID();
  const now = Date.now();

  return await db
    .transaction(
      "rw",
      [db.accounts, db.transactions, db.monthly_summaries],
      async () => {
        await db.accounts.add({
          ...draftAccount,
          id: accountId,
          updatedAt: now,
          syncStatus: "pending",
          archive: 0,
          balance: draftAccount.initialBalance,
        });

        if (draftAccount.initialBalance !== 0) {
          const initialTxn: Transaction = {
            id: crypto.randomUUID(),
            name: t("transactions.initialBalance", { ns: "transactions" }),
            amount: Math.abs(draftAccount.initialBalance),
            date: now,
            kind: draftAccount.initialBalance > 0 ? "income" : "expense",
            note: t("notes.new", { ns: "accounts" }),
            accountId: accountId,
            categoryId: "system",
            categoryIcon: "bolt",
            updatedAt: now,
            syncStatus: "pending",
            archive: 0,
          };

          await db.transactions.add(initialTxn);
          await syncMonthlySummary(initialTxn, "add");
        }

        return { ok: true };
      },
    )
    .catch((error) => {
      console.error("Error adding account:", error);
      return { ok: false };
    });
}

export function useAllAccounts() {
  return useLiveQuery(() => db.accounts.toArray());
}

export function useTotalAccounts() {
  return (
    useLiveQuery(async () => {
      const activeAccounts = await db.accounts.toArray();

      return activeAccounts.reduce((acc, account) => acc + account.balance, 0);
    }) ?? 0
  );
}

export function useAccounts() {
  return (
    useLiveQuery(() => db.accounts.where("archive").equals(0).sortBy("name")) ??
    []
  );
}

export function useAccountById(id: string) {
  return useLiveQuery(async () => {
    return await db.accounts.where("id").equals(id).first();
  }, [id]);
}

export function useAccountsByBalance(limit?: number) {
  return (
    useLiveQuery(() =>
      db.accounts
        .where("archive")
        .equals(0)
        .sortBy("balance")
        .then((a) => a.slice(0, limit)),
    ) ?? []
  );
}

export function useArchivedAccounts() {
  return (
    useLiveQuery(() => db.accounts.where("archive").equals(1).sortBy("name")) ??
    []
  );
}

export async function updateAccount(account: Account) {
  return await db
    .transaction(
      "rw",
      [db.accounts, db.transactions, db.monthly_summaries],
      async () => {
        const oldAccount = await db.accounts.get(account.id);
        if (!oldAccount) throw new Error("Account not found");

        const now = Date.now();
        let newBalance = account.balance;

        if (oldAccount.initialBalance !== account.initialBalance) {
          const diff = account.initialBalance - oldAccount.initialBalance;
          newBalance += diff;

          const initialTxn = await db.transactions
            .where({ accountId: account.id, categoryId: "system" })
            .first();

          if (initialTxn) {
            await syncMonthlySummary(initialTxn, "remove");

            const updatedTxn: Transaction = {
              ...initialTxn,
              amount: Math.abs(account.initialBalance),
              kind: account.initialBalance > 0 ? "income" : "expense",
              updatedAt: now,
            };

            await db.transactions.put(updatedTxn);
            await syncMonthlySummary(updatedTxn, "add");
          }
        }

        await db.accounts.update(account.id, {
          ...account,
          balance: newBalance,
          updatedAt: now,
          syncStatus: "pending",
        });

        return { ok: true };
      },
    )
    .catch((error) => {
      console.error(error);
      return { ok: false };
    });
}

export async function archiveAccount(id: string) {
  const now = Date.now();

  try {
    const affectedRows = await db.accounts.update(id, {
      archive: 1,
      updatedAt: now,
      syncStatus: "pending",
    });

    if (affectedRows === 0) {
      throw new Error("Account not found");
    }

    return { ok: true };
  } catch (error) {
    console.error("Error archiving account:", error);
    return { ok: false };
  }
}

export async function unarchiveAccount(id: string) {
  const now = Date.now();

  try {
    const affectedRows = await db.accounts.update(id, {
      archive: 0,
      updatedAt: now,
      syncStatus: "pending",
    });

    if (affectedRows === 0) {
      throw new Error("Account not found");
    }

    return { ok: true };
  } catch (error) {
    console.error("Error unarchiving account:", error);
    return { ok: false };
  }
}
