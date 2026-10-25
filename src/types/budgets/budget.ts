import * as v from "valibot";
import { vBudgetDraft } from "./budget-draft";

export const vBudget = v.object({
  id: v.number(),
  categoryIcon: v.string(),
  categoryName: v.string(),
  isDeleted: v.union([v.literal(0), v.literal(1)]),
  ...vBudgetDraft.entries,
});

export type Budget = v.InferOutput<typeof vBudget>;
