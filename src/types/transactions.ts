export type Transaction = {
  id: string;
  name: string;
  amount: number;
  date: number;
  kind: "expense" | "income";
  note: string;
  accountId: string;
  transferId?: string;
  relatedAccountId?: string;
  categoryId: string;
  categoryIcon: string;
  archive: 0 | 1;
  updatedAt: number;
  syncStatus: "pending" | "synced" | "conflict";
};

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
