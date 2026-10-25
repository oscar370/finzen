import { db } from "@/lib/dexie/db";
import Dexie from "dexie";

export async function getTransactionsByKind(
  yearMonth: string,
  kind: "income" | "expense"
) {
  return db.transactions
    .where("[kind+yearMonth+date+isDeleted]")
    .between(
      [kind, yearMonth, Dexie.minKey, 0],
      [kind, yearMonth, Dexie.maxKey, 0]
    )
    .filter((transaction) => transaction.isDeleted === 0)
    .reverse()
    .toArray();
}
