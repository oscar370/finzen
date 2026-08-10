import { m } from "#/paraglide/messages";
import * as v from "valibot";

export const vDraftBudget = v.object({
  amount: v.pipe(
    v.number(m["errors.invalid_value"]()),
    v.minValue(1, m["errors.min_value"]({ v: 1 })),
  ),
  yearMonth: v.pipe(v.string(), v.regex(/^\d{4}-(0[1-9]|1[0-2])$/)),
  kind: v.union([v.literal("expense"), v.literal("income")]),
  categoryId: v.number(),
  repeat: v.boolean(),
  relatedBudget: v.optional(v.number()),
});

export const vBudget = v.object({
  id: v.number(),
  categoryIcon: v.string(),
  categoryName: v.string(),
  isDeleted: v.union([v.literal(0), v.literal(1)]),
  ...vDraftBudget.entries,
});

export type DraftBudget = v.InferOutput<typeof vDraftBudget>;
export type Budget = v.InferOutput<typeof vBudget>;
