import z from "zod";
import { ArchiveStatusSchema, SyncStatusSchema } from "./common";

export const TransactionSchema = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.number(),
  date: z.number(),
  kind: z.enum(["expense", "income"]),
  note: z.string(),
  accountId: z.string(),
  transferId: z.string().optional(),
  relatedAccountId: z.string().optional(),
  categoryId: z.string(),
  categoryIcon: z.string(),
  archive: ArchiveStatusSchema,
  updatedAt: z.number(),
  syncStatus: SyncStatusSchema,
});

export type Transaction = z.infer<typeof TransactionSchema>;

export type DraftTransaction = Pick<
  Transaction,
  "name" | "amount" | "date" | "kind" | "note" | "accountId" | "categoryId"
>;

export type DraftTransactionForm = Omit<DraftTransaction, "date"> & {
  date: string;
};

export type TransactionForm = Omit<Transaction, "date"> & {
  date: string;
};

export type Transfer = {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  date: number;
  note: string;
};

export type TransferForm = Omit<Transfer, "date"> & {
  date: string;
};
