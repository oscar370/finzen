import { db } from "@/lib/dexie";
import type {
  DraftTransaction,
  Transaction,
  Transfer,
} from "@/types/transactions";
import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { t } from "i18next";
import { syncMonthlySummary } from "./monthly-summary";

export async function addTransaction(data: DraftTransaction) {
  const id = crypto.randomUUID();
  const now = Date.now();

  try {
    const categoryIcon =
      (await db.categories.get(data.categoryId))?.icon || "helpCircle";

    const transaction: Transaction = {
      ...data,
      id,
      updatedAt: now,
      syncStatus: "pending",
      archive: 0,
      categoryIcon,
    };

    const account = await db.accounts.get(data.accountId);

    if (!account) {
      throw new Error(
        `The account with the ID '${data.accountId}' could not be found`,
      );
    }

    const change = data.kind === "expense" ? -data.amount : data.amount;

    await db.transactions.add(transaction);
    await db.accounts.update(data.accountId, {
      balance: account.balance + change,
      updatedAt: now,
    });
    await syncMonthlySummary(transaction, "add");

    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false };
  }
}

export async function addTransfer(transfer: Transfer) {
  const transferId = crypto.randomUUID();
  const now = Date.now();

  return await db
    .transaction("rw", [db.accounts, db.transactions], async () => {
      if (transfer.fromAccountId === transfer.toAccountId)
        throw new Error("Cannot transfer to same account");

      const fromAccount = await db.accounts.get(transfer.fromAccountId);
      const toAccount = await db.accounts.get(transfer.toAccountId);
      if (!fromAccount || !toAccount) throw new Error("Accounts not found");

      const outflowTxn: Transaction = {
        id: crypto.randomUUID(),
        name: `${t("transactions.transfer", { ns: "transactions" })} ${toAccount.name}`,
        kind: "expense",
        amount: transfer.amount,
        date: transfer.date,
        accountId: transfer.fromAccountId,
        categoryId: "system",
        categoryIcon: "bolt",
        note: transfer.note,
        transferId: transferId,
        relatedAccountId: transfer.toAccountId,
        updatedAt: now,
        archive: 0,
        syncStatus: "pending",
      };

      const inflowTxn: Transaction = {
        id: crypto.randomUUID(),
        name: `${t("transactions.transfer", { ns: "transactions" })} ${toAccount.name}`,
        kind: "income",
        amount: transfer.amount,
        date: transfer.date,
        accountId: transfer.toAccountId,
        categoryId: "system",
        categoryIcon: "bolt",
        note: transfer.note,
        transferId: transferId,
        relatedAccountId: transfer.fromAccountId,
        updatedAt: now,
        archive: 0,
        syncStatus: "pending",
      };

      await db.transactions.bulkAdd([outflowTxn, inflowTxn]);

      await db.accounts.update(transfer.fromAccountId, {
        balance: fromAccount.balance - transfer.amount,
        updatedAt: now,
        syncStatus: "pending",
      });

      await db.accounts.update(transfer.toAccountId, {
        balance: toAccount.balance + transfer.amount,
        updatedAt: now,
        syncStatus: "pending",
      });

      return { ok: true };
    })
    .catch((err) => {
      console.error("Transfer error:", err);
      return { ok: false };
    });
}

export function useIncomes(
  from: number,
  to: number,
  limit: number,
  search?: string,
  categoryId?: string,
) {
  return (
    useLiveQuery(async () => {
      const collection = db.transactions
        .where("[archive+kind+date]")
        .between([0, "income", from], [0, "income", to], true, true)
        .reverse()
        .limit(limit);

      let items = await collection.toArray();

      if (categoryId) items = items.filter((t) => t.categoryId === categoryId);
      if (search) {
        const s = search.toLowerCase();
        items = items.filter(
          (t) =>
            t.name.toLowerCase().includes(s) ||
            t.note?.toLowerCase().includes(s),
        );
      }

      return items;
    }, [from, to, limit, search, categoryId]) ?? []
  );
}

export function useExpenses(
  from: number,
  to: number,
  limit: number,
  search?: string,
  categoryId?: string,
) {
  return (
    useLiveQuery(async () => {
      const collection = db.transactions
        .where("[archive+kind+date]")
        .between([0, "expense", from], [0, "expense", to], true, true)
        .reverse()
        .limit(limit);

      let items = await collection.toArray();

      if (categoryId) items = items.filter((t) => t.categoryId === categoryId);
      if (search) {
        const s = search.toLowerCase();
        items = items.filter(
          (t) =>
            t.name.toLowerCase().includes(s) ||
            t.note?.toLowerCase().includes(s),
        );
      }

      return items;
    }, [from, to, limit, search, categoryId]) ?? []
  );
}

export function useTransactions(limit: number = 5) {
  return (
    useLiveQuery(async () => {
      return await db.transactions
        .where("[archive+date]")
        .between([0, Dexie.minKey], [0, Dexie.maxKey])
        .reverse()
        .limit(limit)
        .toArray();
    }, [limit]) ?? []
  );
}

export function useTransactionsByAccount(
  id: string,
  page: number,
  pageSize: number,
) {
  return (
    useLiveQuery(async () => {
      return await db.transactions
        .where("accountId")
        .equals(id)
        .offset(page * pageSize)
        .sortBy("date")
        .then((v) => {
          const sorts = v.reverse();
          return sorts.slice(0, pageSize);
        });
    }, [id, page, pageSize]) ?? []
  );
}

export function useTransactionById(id: string) {
  return useLiveQuery(async () => {
    return await db.transactions.where("id").equals(id).first();
  }, [id]);
}

export function useArchivedTransactions(page: number, pageSize: number) {
  return (
    useLiveQuery(async () => {
      return await db.transactions
        .where("archive")
        .equals(1)
        .reverse()
        .offset(page * pageSize)
        .limit(pageSize)
        .toArray();
    }, [page, pageSize]) ?? []
  );
}

export async function updateTransaction(data: Transaction) {
  return await db
    .transaction(
      "rw",
      [db.transactions, db.accounts, db.monthly_summaries, db.categories],
      async () => {
        const oldTxn = await db.transactions.get(data.id);
        if (!oldTxn) throw new Error("Transaction not found");
        const categoryIcon =
          (await db.categories.get(data.categoryId))?.icon || "helpCircle";

        const now = Date.now();
        const updatedTxn: Transaction = {
          ...data,
          updatedAt: now,
          syncStatus: "pending",
          categoryIcon,
        };

        if (oldTxn.accountId === data.accountId) {
          const account = await db.accounts.get(data.accountId);
          if (account) {
            let adj = 0;
            adj += oldTxn.kind === "expense" ? oldTxn.amount : -oldTxn.amount;
            adj += data.kind === "expense" ? -data.amount : data.amount;

            await db.accounts.update(data.accountId, {
              balance: account.balance + adj,
              updatedAt: now,
              syncStatus: "pending",
            });
          }
        } else {
          const oldAccount = await db.accounts.get(oldTxn.accountId);
          const newAccount = await db.accounts.get(data.accountId);

          if (oldAccount) {
            const restore =
              oldTxn.kind === "expense" ? oldTxn.amount : -oldTxn.amount;
            await db.accounts.update(oldAccount.id, {
              balance: oldAccount.balance + restore,
              updatedAt: now,
            });
          }
          if (newAccount) {
            const apply = data.kind === "expense" ? -data.amount : data.amount;
            await db.accounts.update(newAccount.id, {
              balance: newAccount.balance + apply,
              updatedAt: now,
            });
          }
        }

        await db.transactions.update(data.id, updatedTxn);

        await syncMonthlySummary(oldTxn, "remove");
        await syncMonthlySummary(updatedTxn, "add");

        return { ok: true };
      },
    )
    .catch((error) => {
      console.error(error);
      return { ok: false };
    });
}

export async function archiveTransaction(id: string) {
  return await db
    .transaction(
      "rw",
      [db.transactions, db.accounts, db.monthly_summaries],
      async () => {
        const txn = await db.transactions.get(id);
        if (!txn || txn.archive === 1) return;

        await syncMonthlySummary(txn, "remove");

        const account = await db.accounts.get(txn.accountId);
        if (account) {
          const restoreAmount =
            txn.kind === "expense" ? txn.amount : -txn.amount;
          await db.accounts.update(txn.accountId, {
            balance: account.balance + restoreAmount,
            updatedAt: Date.now(),
          });
        }

        await db.transactions.update(id, {
          archive: 1,
          updatedAt: Date.now(),
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

export async function unarchiveTransaction(id: string) {
  return await db
    .transaction(
      "rw",
      [db.transactions, db.accounts, db.monthly_summaries],
      async () => {
        const txn = await db.transactions.get(id);

        if (!txn || txn.archive === 0) return;

        await syncMonthlySummary(txn, "add");

        const account = await db.accounts.get(txn.accountId);
        if (account) {
          const adjustAmount =
            txn.kind === "expense" ? -txn.amount : txn.amount;

          await db.accounts.update(txn.accountId, {
            balance: account.balance + adjustAmount,
            updatedAt: Date.now(),
          });
        }

        await db.transactions.update(id, {
          archive: 0,
          updatedAt: Date.now(),
          syncStatus: "pending",
        });

        return { ok: true };
      },
    )
    .catch((error) => {
      console.error("Error unarchiving transaction:", error);
      return { ok: false };
    });
}

export async function deleteTransfer(transferId: string) {
  return await db.transaction(
    "rw",
    [db.accounts, db.transactions],
    async () => {
      const txns = await db.transactions
        .where("transferId")
        .equals(transferId)
        .toArray();
      if (txns.length === 0) return { ok: true };

      for (const txn of txns) {
        const account = await db.accounts.get(txn.accountId);
        if (account) {
          const reversalAmount =
            txn.kind === "expense" ? txn.amount : -txn.amount;

          await db.accounts.update(txn.accountId, {
            balance: account.balance + reversalAmount,
            updatedAt: Date.now(),
            syncStatus: "pending",
          });
        }
      }

      await db.transactions.where("transferId").equals(transferId).delete();

      return { ok: true };
    },
  );
}
