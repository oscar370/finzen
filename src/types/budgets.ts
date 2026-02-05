export type Budget = {
  id: string;
  year: number;
  month: number;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  amount: number;
  kind: "expense" | "income";
  updatedAt: number;
  syncStatus: "pending" | "synced" | "conflict";
  deleted: 0 | 1;
};

export type BudgetFrom = Omit<Budget, "year" | "month"> & {
  year: string;
  month: string;
};

export type BudgetDraft = Pick<
  Budget,
  "year" | "month" | "categoryId" | "amount" | "kind"
>;

export type BudgetDraftForm = Pick<
  BudgetDraft,
  "categoryId" | "amount" | "kind"
> & {
  year: string;
  month: string;
};
