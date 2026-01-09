export type Account = {
  id: string;
  name: string;
  type: "cash" | "debit" | "credit" | "investment";
  balance: number;
  initialBalance: number;
  archive: 0 | 1;
  updatedAt: number;
  syncStatus: "pending" | "synced" | "conflict";
};

export type DraftAccount = Pick<Account, "name" | "type" | "initialBalance">;
