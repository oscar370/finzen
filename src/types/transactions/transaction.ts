import * as v from "valibot";
import { vTransactionDraft } from "./transaction-draft";

export const vTransaction = v.object({
  id: v.number(),
  categoryIcon: v.string(),
  categoryName: v.string(),
  yearMonth: v.pipe(v.string(), v.regex(/^\d{4}-(0[1-9]|1[0-2])$/)),
  isDeleted: v.union([v.literal(1), v.literal(0)]),
  ...vTransactionDraft.entries,
});

export type Transaction = v.InferOutput<typeof vTransaction>;
