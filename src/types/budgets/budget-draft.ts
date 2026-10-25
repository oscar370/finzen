import { m } from "@/paraglide/messages";
import * as v from "valibot";

export const vBudgetDraft = v.object({
  amount: v.pipe(
    v.number(m.errors_invalid_value()),
    v.minValue(1, m.errors_min_value({ v: 1 }))
  ),
  yearMonth: v.pipe(v.string(), v.regex(/^\d{4}-(0[1-9]|1[0-2])$/)),
  kind: v.union([v.literal("expense"), v.literal("income")]),
  categoryId: v.number(),
  repeat: v.boolean(),
  relatedBudget: v.optional(v.number()),
});

export type BudgetDraft = v.InferOutput<typeof vBudgetDraft>;
