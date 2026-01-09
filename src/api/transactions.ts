import { db } from "@/lib/dexie";
import type { DraftTransaction, Transaction } from "@/types/transactions";
import { useLiveQuery } from "dexie-react-hooks";
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

export function useIncomes(
  from: number,
  to: number,
  page: number,
  pageSize: number,
) {
  return (
    useLiveQuery(async () => {
      return await db.transactions
        .where("[archive+kind+date]")
        .between([0, "income", from], [0, "income", to], true, true)
        .reverse()
        .offset(page * pageSize)
        .limit(pageSize)
        .toArray();
    }, [from, to, page, pageSize]) ?? []
  );
}

export function useExpenses(
  from: number,
  to: number,
  page: number,
  pageSize: number,
) {
  return (
    useLiveQuery(async () => {
      return await db.transactions
        .where("[archive+kind+date]")
        .between([0, "expense", from], [0, "expense", to], true, true)
        .reverse()
        .offset(page * pageSize)
        .limit(pageSize)
        .toArray();
    }, [from, to, page, pageSize]) ?? []
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
        .reverse()
        .offset(page * pageSize)
        .limit(pageSize)
        .toArray();
    }, [id, page, pageSize]) ?? []
  );
}

export function useTransactionsById(id: string) {
  return useLiveQuery(async () => {
    return await db.transactions.where("id").equals(id).first();
  }, [id]);
}

export async function updateTransaction(data: Transaction) {
  return await db
    .transaction(
      "rw",
      [db.transactions, db.accounts, db.monthly_summaries],
      async () => {
        const oldTxn = await db.transactions.get(data.id);
        if (!oldTxn) throw new Error("Transaction not found");

        const now = Date.now();
        const updatedTxn: Transaction = {
          ...data,
          updatedAt: now,
          syncStatus: "pending",
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
