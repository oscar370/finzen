import z from "zod";
import { ArchiveStatusSchema, SyncStatusSchema } from "./common";

export const BudgetSchema = z.object({
  id: z.string(),
  year: z.number(),
  month: z.number(),
  categoryId: z.string(),
  categoryName: z.string(),
  categoryIcon: z.string(),
  amount: z.number(),
  kind: z.enum(["expense", "income"]),
  updatedAt: z.number(),
  syncStatus: SyncStatusSchema,
  deleted: ArchiveStatusSchema,
});

export type Budget = z.infer<typeof BudgetSchema>;

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
